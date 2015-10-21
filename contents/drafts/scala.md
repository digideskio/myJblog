# [Scala]

## vim 開發環境

eclipse : 要安裝app, 非installer那個

eclim: 安裝指定eclipse路徑在`/Applications/eclipse..`

注意brew安裝的python會和YCM衝到, 要執行`brew unlink python`

**formater** vim 使用 :! scalariform a.scala

**linter**

## syntax 

```
// Unlike defs, even the input type of anonymous functions can be omitted if the
// context makes it clear. Notice the type "Int => Int" which means a function
// that takes Int and returns Int.
val sq: Int => Int = x => x * x

// Anonymous functions can be called as usual:
sq(10)   // => 100
```

more: 

```
// If each argument in your anonymous function is
// used only once, Scala gives you an even shorter way to define them. These
// anonymous functions turn out to be extremely common, as will be obvious in
// the data structure section.
val addOne: Int => Int = _ + 1
val weirdSum: (Int, Int) => Int = (_ * 2 + _ * 3)

addOne(5)      // => 6
weirdSum(2, 4) // => 16
```

## links 

推薦: http://learnxinyminutes.com/docs/scala/

http://bleibinha.us/blog/2013/08/my-vim-setup-for-scala

http://vigtig.it/blog/blog/2011/04/05/learning-scala-in-5-parts-part-1/

http://www.codedata.com.tw/java/scala-tutorial-2-development-env-operator/
