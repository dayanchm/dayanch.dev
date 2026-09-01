---
title: "For Loop in Go"
author: "dayanch"
createdAt: "2025-01-18T17:00:00.000Z"
description: "Learn how to use the for loop in Go, including its syntax and examples."
category: "golang"
---

The for loop is the only loop construct in Go. It can be used in several ways, making it versatile for different scenarios.

### Basic Syntax
The basic syntax of a for loop is:
```go
for initialization; condition; post {
    // code to execute
}
```

### Example 1: Counting from 1 to 5
```go
for i := 1; i <= 5; i++ {
    fmt.Println(i)
}
```
This will print numbers from 1 to 5.

### Example 2: Using a for loop with a slice
```go
fruits := []string{"apple", "banana", "cherry"}
for i, fruit := range fruits {
    fmt.Printf("%d: %s\n", i, fruit)
}
```
This will print each fruit along with its index.

### Example 3: Infinite Loop
You can create an infinite loop using for without any conditions:
```go
for {
    // code to execute indefinitely
}
```
Be cautious with infinite loops, as they can cause your program to hang if not handled properly.

### Conclusion
The for loop in Go is powerful and flexible, allowing you to iterate over collections, count, or even create infinite loops. Understanding its syntax and usage is crucial for effective programming in Go.
