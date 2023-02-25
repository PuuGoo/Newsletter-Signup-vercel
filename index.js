import express from "express";
import bodyParser from "body-parser";
import request from "request";
import path from "path";
import { fileURLToPath } from "url";
import https from "https";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",(req,res) => {
    const firstName = req.body.FName;
    const lastName = req.body.LName;
    const email = req.body.Email;
    // Tạo biến mới data , đặt nó làm đối tượng JS mới. Chúng ta phải tạo dữ liệu muốn đăng dưới dạng JSON
    const data = {
        members:  [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us18.api.mailchimp.com/3.0/lists/b9902bef7a";
    const options = {
        method: "POST",
        auth: "PuuGoo:24dce4d9a9deaf0ae1137774b0576d6f-us18"
    };
    const request = https.request(url, options, (response) => {
        if (response.statusCode === 200) {
            // Successfully Subscribed
            res.sendFile(__dirname + "/success.html");
        } else {
            // There are an error with signing up, please try again
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure", (req,res) => {
    res.redirect("/");
});
// process.env.PORT : Cơ bản của 1 cổng linh hoạt mà Heroku sẽ định nghĩa diễn ra.
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
});
// API Key MailChimp
// 24dce4d9a9deaf0ae1137774b0576d6f-us18

// List ID
// b9902bef7a

// git init : khởi tạo 1 kho lưu trữ hoàn toàn mới
// git add . : Chúng ta sẽ thêm tất cả các tệp vào kho lưu trữ hiện tại này
// git commit : Chúng ta bắt đầu một phiên bản mới 
// git commit -m "first commit
// heroku create : tạo và đăng nhập theo hướng dẫn 
// git push heroku master : This will push local version that's been stored using git to Hroku
// https://thawing-mountain-65576.herokuapp.com/
// Nếu không có heroku , node, express sẽ mất 1-2 tháng để viết code và 2 tháng để xây dựng own server stack(hệ thống)
// heroku logs : Nếu bạn gặp bất kỳ vấn đề nào khi thực hiện bất kỳ điều gì trong số đố hãy đảm bảo rằng bạn kiểm tra nhật ký và nó thường cho bạn tháy dấu hiệu về những gì có thể đã xảy ra