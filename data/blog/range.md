---
title: "Range"
author: "dayanch"
createdAt: "2025-01-19T17:00:00.000Z"
description: "Learn how to use the `range` keyword in Go to iterate over arrays, slices, maps, and channels."
category: "golang"
---

The range keyword in Go is a powerful feature that allows you to iterate over various data structures such as arrays, slices, maps, and channels. It simplifies the process of looping through these collections and provides a clean syntax.

### Using range with Arrays and Slices
When using range with arrays or slices, it returns two values: the index and the value at that index.

#### Example 1: Iterating over a Slice
```go
fruits := []string{"apple", "banana", "cherry"}
for i, fruit := range fruits {
    fmt.Printf("%d: %s\n", i, fruit)
}
```
This will output:
```
0: apple
1: banana
2: cherry
```

#### Example 2: Ignoring the Index
If you only need the value and not the index, you can use the underscore `_` to ignore it:
```go
for _, fruit := range fruits {
    fmt.Println(fruit)
}
```
This will print:
```
apple
banana
cherry
```

### Using range with Maps
When using range with maps, it returns two values: the key and the value associated with that key.

#### Example 3: Iterating over a Map
```go
m := map[string]int{"a": 1, "b": 2, "c": 3}
for k, v := range m {
    fmt.Printf("%s: %d\n", k, v)
}
```
This will output:
```
a: 1
b: 2
c: 3
```
Note that the order of iteration over a map is not guaranteed to be consistent.

### Using range with Channels
When using range with channels, it will receive values from the channel until it is closed.

#### Example 4: Iterating over a Channel
```go
gen := func(ch chan int) {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch)
}
ch := make(chan int)
go gen(ch)
for n := range ch {
    fmt.Println(n)
 }
```
This will output:
```
0
1
2
3
4
```

### Conclusion
The range keyword in Go is a versatile and convenient way to iterate over arrays, slices, maps, and channels. It simplifies the syntax and makes your code cleaner and more readable. Understanding how to use range effectively is essential for writing idiomatic Go code.
