---
title: "The Network Troubleshooting Field Guide: From Ping to Packet Capture"
author: "dayanch"
createdAt: "2026-07-27T00:00:00.000Z"
description: "A practical, layered guide to diagnosing connectivity, DNS, routing, ports, HTTP, TLS, bandwidth, Linux services, VPNs, and packets with the essential command-line tools."
category: "networking"
---

Networks rarely fail with a useful message. A browser says “site cannot be reached,” an application times out, or a server appears healthy while users still cannot connect. The fastest way through the confusion is not to try random commands. It is to test the network **one layer at a time**.

This is the field guide I want beside me when something breaks. It starts at the local interface, follows the route through DNS and transport, inspects HTTP and TLS, and ends with packet capture. Every command answers a specific question.

> Run scans and packet captures only on systems and networks you own or are explicitly authorized to test. Troubleshooting is not permission to probe somebody else’s infrastructure.

## The five-minute workflow

Before reaching for the detailed reference, use this sequence:

1. **Local state:** Does the machine have an address and an active interface?
2. **Local path:** Is there a default gateway, and can I reach it?
3. **Internet path:** Can I reach a known IP address?
4. **DNS:** Does the name resolve to the expected address?
5. **Transport:** Is the destination TCP or UDP port reachable?
6. **Application:** Does the HTTP, TLS, SSH, or other protocol behave correctly?
7. **Evidence:** If the answer is still unclear, inspect logs and packets.

```bash
ip -brief address                    # 1. Local interfaces and addresses
ip route                             # 2. Routing table and default gateway
ping -c 4 1.1.1.1                    # 3. Basic IP reachability
dig +short example.com               # 4. DNS resolution
nc -vz -w 3 example.com 443          # 5. TCP connection test
curl -vI https://example.com         # 6. HTTP and TLS conversation
sudo tcpdump -ni any host 93.184.216.34  # 7. Packets, when needed
```

If an IP address works but a hostname does not, suspect DNS. If DNS works but the TCP connection fails, suspect routing, a firewall, the listening service, or the port. If TCP connects but the application fails, move up to HTTP, TLS, authentication, or server logs.

## Quick command map

| Question | First tool | Useful alternatives |
|---|---|---|
| Is the host reachable? | `ping` | `fping`, `arping` |
| Which path do packets take? | `traceroute` | `tracepath`, `tracert`, `mtr` |
| Is DNS correct? | `dig` | `host`, `nslookup`, `resolvectl` |
| Does HTTP/HTTPS work? | `curl` | `wget`, `httpie` |
| Is a port reachable? | `nc` | `nmap`, `telnet` |
| What is listening locally? | `ss` | `lsof -i`, `netstat` |
| What are my interfaces and routes? | `ip` | `ifconfig`, `route`, `nmcli` |
| Who is on the local link? | `ip neigh` | `arp`, `arping` |
| What do the packets show? | `tcpdump` | `tshark`, Wireshark |
| Is DNS/TLS the slow part? | `curl -w` | `openssl s_client` |
| Is the link fast enough? | `iperf3` | `speedtest-cli` |
| Is a Linux service healthy? | `systemctl` | `journalctl`, `dmesg` |
| Is the VPN healthy? | `wg` | `ip xfrm`, vendor tools |

## 1. Local interfaces: `ip`, `ifconfig`, `nmcli`, and `ethtool`

Start with the machine itself. On modern Linux, `ip` is the primary tool; `ifconfig` is older but remains common on macOS and legacy Unix systems. Windows uses `ipconfig`.

```bash
ip -brief link
ip -brief address
ip -s link show dev eth0

ifconfig -a                 # macOS and legacy Unix/Linux
ipconfig /all               # Windows
```

Check that the expected interface is `UP`, has the expected IPv4 or IPv6 address, and is not accumulating errors or dropped packets. An address beginning with `169.254` usually means automatic link-local configuration was used because DHCP did not provide an address.

NetworkManager users can inspect connection state and DNS without reading configuration files:

```bash
nmcli device status
nmcli connection show --active
nmcli device show eth0
```

For a physical Ethernet link, `ethtool` reveals negotiated speed, duplex, link status, driver details, and interface counters:

```bash
sudo ethtool eth0
sudo ethtool -S eth0
```

A duplex mismatch, rapidly growing CRC errors, or repeated carrier loss points below IP: cable, switch port, transceiver, driver, or hardware.

## 2. Reachability and latency: `ping`, `fping`, and `arping`

`ping` sends ICMP Echo Requests and measures whether replies return and how long they take.

```bash
ping -c 5 example.com              # Linux/macOS: send five probes
ping -n 5 example.com              # Windows: send five probes
ping -c 5 -s 1400 1.1.1.1         # Test with a larger payload
ping -6 -c 5 example.com           # Force IPv6
```

Read three things: **packet loss**, **round-trip time**, and **variation**. Consistent high latency suggests distance or congestion; unstable latency suggests queueing, wireless interference, or an overloaded device. Loss close to the destination matters more than an intermediate router that simply deprioritizes ICMP.

A failed ping does **not** prove a host is down. Firewalls commonly block ICMP while allowing application traffic. Confirm with `nc`, `curl`, or another protocol the server is expected to accept.

`fping` is convenient for checking several known hosts, while `arping` tests a neighbor on the same Layer 2 network and can expose duplicate addresses:

```bash
fping -a -q 10.0.0.1 10.0.0.10 10.0.0.20
sudo arping -I eth0 10.0.0.1
sudo arping -D -I eth0 10.0.0.50   # Duplicate-address detection
```

## 3. The packet path: `traceroute`, `tracepath`, and `mtr`

`traceroute` discovers routers along a path by sending probes with progressively larger TTL values. On Windows the command is `tracert`.

```bash
traceroute example.com
traceroute -n example.com          # Skip reverse DNS for faster, cleaner output
traceroute -T -p 443 example.com   # TCP probes to HTTPS, Linux
tracert -d example.com             # Windows, without name lookups
tracepath example.com              # No root required; also reports path MTU
```

An asterisk means no reply arrived for that probe; it does not automatically mean packet loss at that router. Routers may rate-limit or ignore traceroute while forwarding normal traffic perfectly. Look for loss or latency that begins at one hop **and continues through later hops**.

`mtr` combines ping and traceroute into a continuously updated view. It is excellent for intermittent latency and loss:

```bash
mtr example.com
mtr -rwzc 100 example.com          # Report mode, wide output, 100 cycles
mtr -T -P 443 -rwzc 100 example.com
```

Save report-mode output from both directions if possible. Internet routes are asymmetric, so the forward path may be healthy while the return path is not.

## 4. DNS: `dig`, `host`, `nslookup`, and `resolvectl`

DNS problems often look like network problems. Test the configured resolver, then compare it with a known resolver.

```bash
dig example.com
dig +short example.com
dig example.com AAAA
dig example.com MX
dig example.com TXT
dig @1.1.1.1 example.com
dig +trace example.com
dig -x 93.184.216.34               # Reverse lookup
```

Important fields include `status` (`NOERROR`, `NXDOMAIN`, or `SERVFAIL`), `ANSWER`, the responding `SERVER`, query time, and TTL. `NXDOMAIN` means the name does not exist according to DNS; `SERVFAIL` usually points to resolver trouble, DNSSEC validation, or an authoritative server failure.

`host` is concise and `nslookup` is widely available, especially on Windows:

```bash
host -t MX example.com
nslookup example.com
nslookup example.com 1.1.1.1
```

On systemd-based Linux, inspect the resolver actually assigned to each interface:

```bash
resolvectl status
resolvectl query example.com
resolvectl flush-caches
```

Also check `/etc/hosts` and `/etc/resolv.conf`. Local overrides, split DNS, search domains, and VPN-provided resolvers can make two machines resolve the same name differently.

## 5. HTTP and HTTPS: `curl`, `wget`, and timing

`curl` is far more than a downloader. Its verbose output shows name resolution, connection attempts, TLS negotiation, request headers, response headers, redirects, and protocol versions.

```bash
curl -I https://example.com                    # Headers only
curl -v https://example.com                    # Full conversation details
curl -L https://example.com                    # Follow redirects
curl --fail-with-body https://example.com/api  # Fail on HTTP 4xx/5xx
curl --connect-timeout 3 --max-time 10 https://example.com
curl -4 https://example.com                    # Force IPv4
curl -6 https://example.com                    # Force IPv6
```

To test a virtual host against a specific address without changing DNS:

```bash
curl -v --resolve example.com:443:203.0.113.10 https://example.com/
```

This preserves the hostname for TLS SNI and the HTTP `Host` header while connecting to the chosen IP. It is safer and more accurate than calling the HTTPS IP directly.

For APIs:

```bash
curl -sS -X POST https://api.example.com/items \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer REDACTED' \
  --data '{"name":"test"}'
```

Do not paste real tokens into shared terminals, shell history, tickets, or screenshots. Prefer a protected environment variable or a secret manager.

Timing output separates DNS, TCP, TLS, first-byte, and total time:

```bash
curl -sS -o /dev/null \
  -w 'dns=%{time_namelookup}s connect=%{time_connect}s tls=%{time_appconnect}s first_byte=%{time_starttransfer}s total=%{time_total}s\n' \
  https://example.com
```

If DNS time is high, investigate resolvers. If connect time is high, investigate routing or firewalls. If TLS time is high, inspect certificates and TLS. If time-to-first-byte is high, the application or its upstream dependencies are likely slow.

`wget --spider URL` checks whether a resource exists without downloading it. HTTPie (`http`) offers friendly syntax for interactive API work.

## 6. Ports and raw connections: `nc`, `telnet`, and `nmap`

Netcat (`nc`) answers a narrow question quickly: can I establish a TCP connection to this host and port?

```bash
nc -vz -w 3 example.com 443
nc -vz -w 3 example.com 22
nc -vzu -w 2 10.0.0.53 53          # UDP; results are less definitive
```

“Connection refused” normally means the destination is reachable but nothing is listening, or a firewall actively rejected it. A timeout suggests silent filtering, a routing problem, or an unreachable host. UDP has no handshake, so a successful-looking UDP test does not prove the application responded.

`telnet host port` can perform a similar plain TCP test, but it is not secure remote login. Do not use Telnet for credentials.

`nmap` is better when you need controlled service discovery:

```bash
nmap -sT -p 22,80,443 10.0.0.10
nmap -sV -p 22,80,443 10.0.0.10
nmap -sn 10.0.0.0/24               # Host discovery only
sudo nmap -sS -O 10.0.0.10         # SYN scan and OS hints
```

Nmap reports ports as `open`, `closed`, or `filtered`. Version and OS detection are informed guesses, not guaranteed facts. Scan only authorized targets, limit the port range, and avoid aggressive timing on production systems.

## 7. Remote access: `ssh`, `scp`, and `sftp`

SSH provides encrypted remote shell access and tunneling. Verbose mode is the first step when it fails:

```bash
ssh user@server.example.com
ssh -p 2222 user@server.example.com
ssh -vvv user@server.example.com
ssh -J bastion.example.com user@private.example.com
```

The debug output separates DNS and TCP failures from host-key, key-exchange, and authentication problems. Verify host-key changes through a trusted channel; never delete a warning blindly.

Useful secure file-transfer companions are:

```bash
scp file.txt user@server:/tmp/
sftp user@server
rsync -avz -e ssh ./directory/ user@server:/srv/directory/
```

SSH can also create local forwarding: `ssh -L 8080:127.0.0.1:80 user@server` exposes the server-side port 80 at local port 8080. Bind forwards to loopback unless you intentionally need broader exposure.

## 8. Listening sockets: `ss`, `lsof -i`, and `netstat`

On Linux, `ss` is the modern replacement for most `netstat` socket tasks:

```bash
ss -tulpen                         # Listening TCP/UDP sockets and processes
ss -tan                            # All TCP sockets, numeric addresses
ss -tan state established
ss -s                              # Socket summary
```

`lsof` maps sockets to processes and works well on macOS too:

```bash
sudo lsof -nP -i
sudo lsof -nP -iTCP:443 -sTCP:LISTEN
lsof -nP -i@10.0.0.10
```

Legacy equivalents include `netstat -tulpen` on Linux and `netstat -anv` on macOS. On Windows, use `netstat -ano` and map the PID with Task Manager or `Get-Process -Id PID`.

Pay attention to the bind address. A service listening on `127.0.0.1:8080` accepts only local connections; `0.0.0.0:8080` accepts IPv4 connections on all interfaces, subject to firewall policy. For IPv6, the behavior of `::` can depend on the operating system’s dual-stack settings.

## 9. Routes: `ip route`, `route`, and policy routing

The routing table decides where packets leave the machine.

```bash
ip route
ip -6 route
ip route get 8.8.8.8
ip route get 10.20.30.40 from 10.0.0.5
ip rule
ip route show table all
```

`ip route get` is especially useful because it shows the kernel’s actual decision: output interface, next hop, and source address. Look for a missing default route, a more-specific route stealing traffic, the wrong VPN route, or an unexpected source address.

Legacy/macOS commands include `route -n`, `netstat -rn`, and `route get 8.8.8.8`. Windows uses `route print` or `Get-NetRoute`.

Changing a route can disconnect you immediately. Record the current state and use an out-of-band console before modifying routes on a remote production host.

## 10. Neighbors and the local network: `ip neigh`, `arp`, and `bridge`

Before an IPv4 packet reaches a machine on the same subnet, ARP maps its IP address to a MAC address. IPv6 uses Neighbor Discovery.

```bash
ip neigh show
ip neigh show dev eth0
arp -an                             # Legacy/macOS
bridge fdb show                     # Linux bridge forwarding database
```

States such as `REACHABLE`, `STALE`, `DELAY`, and `FAILED` describe neighbor reachability. Repeated `FAILED` entries can mean the peer is down, VLAN membership is wrong, the subnet mask is incorrect, or Layer 2 traffic is blocked.

ARP output only contains devices the machine has recently communicated with; it is not a complete inventory of the LAN.

## 11. Packet capture: `tcpdump`, `tshark`, and Wireshark

Packet capture shows what actually crossed an interface. Begin with a narrow filter and disable name resolution so the capture itself does not generate noise.

```bash
sudo tcpdump -D                              # List capture interfaces
sudo tcpdump -ni any host 10.0.0.10
sudo tcpdump -ni eth0 port 53
sudo tcpdump -ni eth0 'tcp port 443 and host 10.0.0.10'
sudo tcpdump -ni eth0 -c 100 -w issue.pcap
sudo tcpdump -nn -r issue.pcap
```

Common filters include `src`, `dst`, `host`, `net`, `port`, `tcp`, `udp`, `icmp`, and boolean operators `and`, `or`, and `not`. Quote complex filters so the shell does not reinterpret them.

A TCP handshake looks like `SYN → SYN-ACK → ACK`. Repeated SYN packets with no reply suggest filtering or a missing return path. An immediate RST usually means the host is reachable but the port is closed. Retransmissions and duplicate acknowledgements can indicate packet loss, congestion, or out-of-order delivery.

`tshark` is Wireshark’s command-line engine:

```bash
tshark -i eth0 -f 'port 53'
tshark -r issue.pcap -Y 'dns.flags.rcode != 0'
```

Captures may contain credentials, cookies, internal addresses, personal data, and payloads. Capture the minimum necessary, restrict file permissions, redact before sharing, and delete captures according to your organization’s retention policy.

## 12. TLS certificates: `openssl s_client`

When TCP port 443 opens but HTTPS still fails, inspect the TLS handshake and certificate chain:

```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null
openssl s_client -connect example.com:443 -servername example.com -showcerts </dev/null
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

Always send `-servername` for virtual hosts; it supplies SNI so the server chooses the correct certificate. Check the certificate’s names, validity dates, issuer, chain, and final verification result. A valid certificate can still be wrong for the requested hostname.

## 13. Linux services and logs: `systemctl`, `journalctl`, and `dmesg`

A healthy network cannot help an application that is stopped or repeatedly crashing.

```bash
systemctl status nginx
systemctl is-active nginx
systemctl is-enabled nginx
sudo systemctl restart nginx

journalctl -u nginx --since '30 minutes ago'
journalctl -u nginx -f
journalctl -p warning..alert -b
journalctl -k -b
dmesg --level=err,warn
```

Use `status` and logs before restarting; a restart may erase the transient state you need to diagnose. `journalctl -f` follows new messages, while `-b` limits output to the current boot. Kernel logs can reveal link flaps, driver resets, firewall messages, out-of-memory kills, and hardware trouble.

On macOS, use `launchctl` and the unified `log` command. On Windows, use `Get-Service`, Event Viewer, and `Get-WinEvent`.

## 14. Firewalls: `nft`, `iptables`, `ufw`, and `firewall-cmd`

Modern Linux distributions increasingly use nftables, sometimes behind a higher-level manager.

```bash
sudo nft list ruleset
sudo iptables -S
sudo iptables -L -n -v
sudo ufw status verbose
sudo firewall-cmd --get-active-zones
sudo firewall-cmd --list-all
```

Inspect first. Do not flush rules or disable the firewall as a casual test, especially over SSH. Check rule order, interface and source restrictions, default policies, IPv4 versus IPv6 coverage, and packet counters. Remember that cloud security groups, load balancers, container rules, and upstream firewalls may enforce additional policy outside the host.

## 15. WireGuard: `wg`

`wg` shows WireGuard interfaces, peers, endpoints, allowed networks, latest handshake, and transfer counters.

```bash
sudo wg show
sudo wg show wg0
ip address show dev wg0
ip route show dev wg0
```

A recent handshake proves the peers exchanged WireGuard traffic, but not that application routing is correct. Watch whether transfer counters increase in both directions. Then verify `AllowedIPs`, routes, forwarding, NAT, firewall policy, endpoint reachability, DNS, and MTU.

For a suspected MTU issue, test decreasing payload sizes with ping’s “do not fragment” behavior (`ping -M do -s SIZE` on Linux) and consider the tunnel overhead before changing configuration.

## 16. Throughput: `iperf3`

`iperf3` measures network throughput between a server you control and a client. It does not measure disk or application performance.

```bash
iperf3 -s                              # On the test server
iperf3 -c 10.0.0.20                   # Client to server
iperf3 -c 10.0.0.20 -R                # Reverse direction
iperf3 -c 10.0.0.20 -P 4 -t 30        # Four streams for 30 seconds
iperf3 -c 10.0.0.20 -u -b 100M        # UDP at a controlled target rate
```

Test both directions because capacity and loss can be asymmetric. For TCP, review throughput and retransmissions. For UDP, review loss, jitter, and out-of-order datagrams. A public internet speed test answers a different question and includes the ISP path and public test server.

Performance tests can saturate links and affect users. Coordinate production tests, cap bandwidth, and choose an appropriate duration.

## 17. Useful specialists

Several smaller tools answer questions the general-purpose tools do not:

- `whois example.com` — registrar and registry information; output and privacy redaction vary.
- `ipcalc 192.168.10.34/24` — subnet, usable range, mask, and broadcast calculations.
- `conntrack -L` — Linux state-tracking entries, useful for NAT and stateful firewall diagnosis.
- `socat` — flexible bidirectional relays, sockets, Unix sockets, and controlled protocol tests.
- `pv` — shows throughput through a pipe; useful during transfers.
- `iftop` — live bandwidth by connection.
- `nethogs` — live bandwidth grouped by process.
- `bmon` or `vnstat` — interface traffic views and longer-term counters.
- `iw dev` and `iw dev wlan0 link` — Linux Wi-Fi interface and association state.
- `rfkill list` — whether wireless devices are blocked in software or hardware.
- `lldpctl` — LLDP neighbor information, often revealing the connected switch and port.
- `chronyc sources -v` or `timedatectl timesync-status` — time synchronization; bad time can break TLS, Kerberos, and distributed systems.

Container and orchestration networking add another namespace. `docker network inspect`, `docker exec ... ip route`, `kubectl get endpoints`, and `kubectl exec ... -- ss -lnt` can show whether the failure is inside the workload, the host, or service discovery. Avoid assuming the host’s network view is identical to a container’s.

## Reading symptoms without jumping to conclusions

| Symptom | Likely area | Confirm with |
|---|---|---|
| No interface address | Link, DHCP, configuration | `ip addr`, `nmcli`, `journalctl` |
| Gateway unreachable | Local link, VLAN, Wi-Fi, ARP | `ip route`, `ip neigh`, `arping` |
| IP works, hostname fails | DNS | `dig`, `resolvectl` |
| IPv4 works, IPv6 hangs | IPv6 route, DNS AAAA, firewall | `curl -4`, `curl -6`, `ip -6 route` |
| Connection refused | No listener or active reject | `ss`, `lsof`, service logs |
| Connection times out | Filter or routing failure | `mtr`, `tcpdump`, firewall counters |
| TLS name error | Wrong certificate, SNI, or DNS | `openssl s_client`, `curl -v` |
| HTTP 502/504 | Proxy or upstream application | `curl`, proxy logs, upstream health |
| Fast ping, slow page | DNS, TLS, application, payload | `curl -w`, browser waterfall |
| VPN handshake but no traffic | Routes, AllowedIPs, forwarding, NAT | `wg`, `ip route`, firewall rules |
| Good single flow, poor aggregate traffic | Congestion, shaping, host limits | `iperf3`, `ethtool -S`, interface graphs |

## A disciplined incident checklist

Write down the exact source, destination, port, protocol, time, and expected result. “The network is down” is not a testable statement; “TCP from `10.0.1.12` to `10.0.2.20:443` times out” is.

Then work outward:

1. Reproduce the failure and record the timestamp.
2. Check interface state, address, gateway, and route selection.
3. Test the destination by IP, then by name.
4. Compare IPv4 and IPv6.
5. Test the exact transport port.
6. Verify the local or remote listener and its bind address.
7. Inspect HTTP/TLS/application behavior.
8. Read relevant service, firewall, and kernel logs at the recorded time.
9. Capture narrowly filtered packets on both ends if the boundary remains unclear.
10. Change one thing at a time, retest, and keep a rollback path.

The goal is not to memorize every flag. It is to know what evidence each layer can provide. Start close to the user, move toward the service, and stop as soon as the failed boundary becomes clear. That habit turns a large toolbox into a repeatable troubleshooting method.
