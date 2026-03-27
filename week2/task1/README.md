# 难点
+ 实现本地到数据库的迁移，需要扎实 nodejs 和 mysql 的理论基础。
+ 注意监听根域名时自然返回根页面的问题。
+ 注意挂载 express.json 解析请求体的数据。
+ 注意 rows 的返回值。
+ 注意 datetime-local 和 mysql 中的 UTC 时间的转化，此处使用 Date() 和 toLocaleString()进行转化。
+ 返回不重复的特定栏字段，使用 select distinct 解决。
+ 小范围枚举排序，使用 order by field() 解决。