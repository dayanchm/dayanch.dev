---
title: "Understanding Slices in Go"
author: "dayanch"
createdAt: "2024-08-05T18:00:00.000Z"
description: "Slices in Go are a powerful abstraction over arrays. In this post, we explore how slices work, their syntax, and key behaviors."
category: "golang"
---

In Go, a **slice** is a flexible and powerful wrapper over an array. It allows dynamic sizing and is used extensively in Go programs.

---

### 🔹 Declaring a Slice

You can create a slice using a slice literal:

```go
numbers := []int{1, 2, 3, 4, 5}
```

This is a slice of integers. Unlike arrays, you don’t specify the length.

---

### 🔹 Slicing an Array

Slices can also be created from an array:

```go
arr := [5]int{10, 20, 30, 40, 50}
slice := arr[1:4] // elements 20, 30, 40
```

Slice syntax: `array[start:end]` → includes `start`, excludes `end`

---

### 🔹 Length and Capacity

Slices have **length** and **capacity**:

```go
fmt.Println(len(slice)) // number of elements
fmt.Println(cap(slice)) // number of elements from start to end of underlying array
```

---

### 🔹 Modifying Slices

Slices are references. Modifying a slice affects the underlying array:

```go
arr := [3]int{1, 2, 3}
slice := arr[:]
slice[0] = 99
fmt.Println(arr) // [99 2 3]
```

---

### 🔹 Using `append()`

You can add elements using `append`:

```go
nums := []int{1, 2}
nums = append(nums, 3, 4)
fmt.Println(nums) // [1 2 3 4]
```

Appending beyond capacity may allocate a new array.

---

### 🔹 Copying Slices

Use `copy()` to copy slices:

```go
src := []int{1, 2, 3}
dest := make([]int, len(src))
copy(dest, src)
fmt.Println(dest) // [1 2 3]
```

---

### ⚠️ Common Gotchas

- Appending to a slice may detach it from the original array
- Always check `len()` and `cap()` when slicing

---

### ✅ Summary

- Slices are dynamic, reference-based views over arrays
- They simplify working with collections
- Use `append`, `copy`, and slicing syntax to manipulate them efficiently

Go slices are essential to idiomatic Go programming. Understanding how they work under the hood will help you write more efficient and safe code.

Happy slicing! 🍰
