import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 50 },
        { duration: '1m',  target: 50 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% запросов должны быть быстрее 500мс
        http_req_failed: ['rate<0.01'],   // Ошибок должно быть меньше 1%
    },
};

export default function () {
    const res = http.get('http://localhost:8080/api/v1/competitions');

    check(res, {
        'status is 200': (r) => r.status === 200,
        'content type is json': (r) => r.headers['Content-Type'] && r.headers['Content-Type'].includes('application/json'),
    });
    sleep(1);
}