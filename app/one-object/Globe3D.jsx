"use client";

import { useEffect, useRef } from "react";
import styles from "./one-object.module.css";

const PLACES = [
  { id: "TM", lat: 38.97, lon: 59.56 },
  { id: "JP", lat: 36.2, lon: 138.25 },
  { id: "MA", lat: 31.79, lon: -7.09 },
  { id: "MX", lat: 23.63, lon: -102.55 },
];

export default function Globe3D({ active, onSelect }) {
  const host = useRef(null);
  const state = useRef({ active, onSelect });
  state.current = { active, onSelect };

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    import("three").then((THREE) => {
      if (cancelled || !host.current) return;
      const el = host.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.z = 5.4;
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const globe = new THREE.Group();
      scene.add(globe);
      const texture = new THREE.TextureLoader().load("/one-object/earth.jpg");
      texture.colorSpace = THREE.SRGBColorSpace;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.62, 96, 96),
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.78,
          metalness: 0.05,
        }),
      );
      globe.add(sphere);

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.66, 64, 64),
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.055,
          side: THREE.BackSide,
        }),
      );
      globe.add(atmosphere);

      const markers = [];
      PLACES.forEach((place) => {
        const phi = THREE.MathUtils.degToRad(90 - place.lat);
        const theta = THREE.MathUtils.degToRad(place.lon + 90);
        const position = new THREE.Vector3(
          1.68 * Math.sin(phi) * Math.cos(theta),
          1.68 * Math.cos(phi),
          1.68 * Math.sin(phi) * Math.sin(theta),
        );
        const pin = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 20, 20),
          new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
        );
        pin.position.copy(position);
        pin.userData.id = place.id;
        globe.add(pin);
        markers.push(pin);
      });

      scene.add(new THREE.HemisphereLight(0xfff3dd, 0x17181d, 2.3));
      const key = new THREE.DirectionalLight(0xffffff, 2.8);
      key.position.set(-3, 3, 5);
      scene.add(key);

      let down = null;
      let targetX = 0.12;
      let targetY = -1.1;
      let targetZoom = 5.4;
      const pointer = new THREE.Vector2();
      const raycaster = new THREE.Raycaster();

      const resize = () => {
        const box = el.getBoundingClientRect();
        renderer.setSize(box.width, box.height, false);
        camera.aspect = box.width / box.height;
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(el);
      resize();

      const onDown = (e) => {
        down = { x: e.clientX, y: e.clientY, rx: targetX, ry: targetY };
        renderer.domElement.setPointerCapture(e.pointerId);
      };
      const onMove = (e) => {
        if (!down) return;
        targetY = down.ry + (e.clientX - down.x) * 0.008;
        targetX = Math.max(
          -1.1,
          Math.min(1.1, down.rx + (e.clientY - down.y) * 0.006),
        );
      };
      const onUp = (e) => {
        if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 7) {
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.set(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.intersectObjects(markers)[0];
          if (hit) state.current.onSelect(hit.object.userData.id);
        }
        down = null;
      };
      const onWheel = (e) => {
        e.preventDefault();
        targetZoom = Math.max(
          3.5,
          Math.min(6.2, targetZoom + e.deltaY * 0.003),
        );
      };
      renderer.domElement.addEventListener("pointerdown", onDown);
      renderer.domElement.addEventListener("pointermove", onMove);
      renderer.domElement.addEventListener("pointerup", onUp);
      renderer.domElement.addEventListener("wheel", onWheel, {
        passive: false,
      });

      let frame;
      const clock = new THREE.Clock();
      const animate = () => {
        frame = requestAnimationFrame(animate);
        if (!down) targetY += clock.getDelta() * 0.025;
        else clock.getDelta();
        globe.rotation.x += (targetX - globe.rotation.x) * 0.06;
        globe.rotation.y += (targetY - globe.rotation.y) * 0.06;
        camera.position.z += (targetZoom - camera.position.z) * 0.08;
        markers.forEach((pin) => {
          const isActive = pin.userData.id === state.current.active;
          pin.scale.setScalar(isActive ? 1.6 : 1);
          pin.material.color.set(isActive ? 0xffffff : 0xf59e0b);
        });
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        renderer.domElement.removeEventListener("pointerdown", onDown);
        renderer.domElement.removeEventListener("pointermove", onMove);
        renderer.domElement.removeEventListener("pointerup", onUp);
        renderer.domElement.removeEventListener("wheel", onWheel);
        renderer.dispose();
        texture.dispose();
        el.replaceChildren();
      };
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={host}
      className={styles.globe3d}
      aria-label="Interactive 3D globe"
    />
  );
}
