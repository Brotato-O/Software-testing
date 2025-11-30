import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: "15s", target: 100 },
        { duration: "15s", target: 500 },
        { duration: "15s", target: 1000 },
        { duration: "10s", target: 0 },
    ],
};

export default function () {
    let res = http.get("http://localhost:8080/api/products");

    check(res, {
        "status is 200": (r) => r.status === 200,
        "response time < 1s": (r) => r.timings.duration < 1000,
    });

    sleep(1);
}
