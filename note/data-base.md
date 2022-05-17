## 数据库复习

常用命令：
- login
```bash
mysql -u root -p -h localhost
```
show databases;

create databases table_name
use table_name

```mysql
create table 'post'(
  'id' INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY
)default CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 客户端
TablePlus
