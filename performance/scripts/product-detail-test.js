import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    vus: 200,
    duration: "30s",
};

export default function () {
    const productId = Math.floor(Math.random() * 100) + 1; // random ID
    let res = http.get(`http://localhost:8080/api/products/${productId}`);

    check(res, {
        "status is 200 or 404": (r) => r.status === 200 || r.status === 404,
    });

    sleep(1);
}
