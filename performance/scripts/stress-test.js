import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
    stages: [
        { duration: "10s", target: 500 },
        { duration: "10s", target: 1000 },
        { duration: "10s", target: 2000 },
        { duration: "10s", target: 3000 },
        { duration: "10s", target: 4000 },
        { duration: "10s", target: 5000 },
        { duration: "10s", target: 6000 },
        { duration: "10s", target: 7000 },
        { duration: "10s", target: 8000 },
        { duration: "10s", target: 9000 },
        { duration: "10s", target: 10000 },
        { duration: "10s", target: 0 } // ramp-down
    ],
};

export default function () {
    const payload = JSON.stringify({ username: "testuser", password: "Test123" });
    const params = { headers: { "Content-Type": "application/json" } };

    let res = http.post("http://localhost:8080/api/auth/login", payload, params);

    check(res, { "status 200": (r) => r.status === 200 });

    sleep(1);
}
