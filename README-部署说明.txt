VIREON MEDIA 静态网站部署说明
================================

文件结构
--------
index.html        网站首页
css/styles.css    样式与动画
js/main.js        平台切换、滚动动画及邮件联系功能
images/           图片和平台图标

启用联系邮箱
------------
打开 js/main.js，把第一行：

const CONTACT_EMAIL = "";

改成你的邮箱，例如：

const CONTACT_EMAIL = "contact@vireonmedia.com";

保存后重新上传即可。访客提交表单时，会打开其默认邮件软件，并自动填好询盘内容。

GitHub + Cloudflare 部署
-----------------------
1. 在 GitHub 新建一个仓库，把本文件夹内的全部内容上传到仓库根目录。
2. 登录 Cloudflare，进入 Workers & Pages，连接你的 GitHub 仓库。
3. Framework preset 选择 None；Build command 填 exit 0；Build output directory 填 .
4. 部署完成后，Cloudflare 会提供一个临时访问网址。
5. 在 Cloudflare 项目中添加你从 GoDaddy 购买的自定义域名。
6. 按 Cloudflare 提示，把 GoDaddy 域名的 Nameservers 改成 Cloudflare 提供的地址。

建议
----
- 上传 GitHub 时，不要再套一层文件夹；index.html 应位于仓库根目录。
- 自定义域名和 SSL 生效可能需要一点时间。
- 正式上线前，请先补充联系邮箱并测试一次表单。
