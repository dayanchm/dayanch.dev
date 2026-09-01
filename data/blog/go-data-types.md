---
title: "Go Data Types"
author: "dayanch"
createdAt: "2025-01-12T17:00:00.000Z"
description: "Explore the various data types in Go, including basic types, composite types, and more."
category: "golang"
---

In Go, data types are categorized into two main groups: basic types and composite types. Because Go is a statically typed language, every variable must have a defined type at the time of declaration, and that type cannot change.

## Basic Types

### Numeric Types
- `int, int8, int16, int32, int64` Signed integers.
- `uint, uint8, uint16, uint32, uint64` Unsigned integers.
- `float32, float64` Floating-point numbers.
- `complex64, complex128` Complex numbers.

### Text Types
- `string` A sequence of characters.
- byte Alias for `uint8` typically used for raw data.
- rune Alias for `int32`, represents a Unicode code point.

### Boolean Type
- `bool`: Can be `true` or `false`.

## Composite Types

### Arrays
Fixed-size collections of elements of the same type:
```go
var arr [3]int = [3]int{1, 2, 3}
```

### Slices
Dynamic arrays:
```go
var s []int = []int{4, 5, 6}
```

### Maps
Key-value pairs:
```go
m := map[string]int{"a": 1, "b": 2}
```

### Structs
Custom data structures:
```go
type User struct {
    Name string
    Age  int
}
```

### Interfaces
Abstract types that allow different types to be used interchangeably:
```go
var i interface{} = "hello"
```

### Channels
Used for communication between goroutines:
```go
ch := make(chan int)
```

---

Understanding Go's type system is essential for writing robust, clear, and efficient code. By mastering these types, you'll be better equipped to write idiomatic Go programs.
