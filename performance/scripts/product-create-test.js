import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    stages: [
        { duration: "10s", target: 100 },
        { duration: "20s", target: 300 },
        { duration: "10s", target: 0 },
    ],
};

export default function () {
    const payload = JSON.stringify({
        name: `Product-${Math.random()}`,
        description: "Load testing product",
        price: Math.floor(Math.random() * 10000000),
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = http.post(
        "http://localhost:8080/api/products",
        payload,
        params
    );

    check(res, {
        "status is 201/200": (r) => r.status === 201 || r.status === 200,
    });

    sleep(1);
}
