const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json({ limit: '50mb' }));  // 增加限制以处理大图片
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(__dirname));

// 代理获取token的请求
app.get('/api/token', async (req, res) => {
    try {
        const response = await axios.get('https://aip.baidubce.com/oauth/2.0/token', {
            params: {
                grant_type: 'client_credentials',
                client_id: process.env.API_KEY,
                client_secret: process.env.API_SECRET
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Token获取失败:', error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

// 代理识别请求
app.post('/api/identify', async (req, res) => {
    try {
        const { image, access_token } = req.body;

        // 确保图片数据存在
        if (!image || !access_token) {
            return res.status(400).json({
                error: '缺少必要参数'
            });
        }

        const response = await axios.post(
            'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant',
            `image=${encodeURIComponent(image)}`,
            {
                params: { access_token },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        // 打印识别结果用于调试
        console.log('识别结果:', response.data);

        res.json(response.data);
    } catch (error) {
        console.error('识别失败:', error.response?.data || error.message);
        res.status(500).json({
            error: error.response?.data?.error_msg || error.message
        });
    }
});

// 添加配置接口
app.get('/api/config', (req, res) => {
    // 只返回前端需要的安全配置
    res.json({
        apiEndpoint: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/plant',
        // 其他公开配置...
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        error: '服务器内部错误'
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`代理服务器运行在 ${PORT} 端口`);
}); 