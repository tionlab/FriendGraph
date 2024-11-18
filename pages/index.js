import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/Main.module.css";

const HomePage = () => {
    const [graph, setGraph] = useState({
        numVertices: 6,
        adjLists: Array.from({ length: 6 }, () => []),
    });
    const [recs, setRecs] = useState([]);
    const [selected, setSelected] = useState(null);

    const createNode = (name) => ({ name });

    const addEdge = (src, dest) => {
        const { adjLists } = graph;
        const srcIdx = src.charCodeAt(0) - 65;
        const destIdx = dest.charCodeAt(0) - 65;

        adjLists[srcIdx].push(createNode(dest));
        adjLists[destIdx].push(createNode(src));

        setGraph({ ...graph });
        console.log(`${src}와 ${dest}가 친구가 되었습니다.`);
    };

    const recommend = (user) => {
        const idx = user.charCodeAt(0) - 65;
        const { adjLists, numVertices } = graph;
        const recommended = Array(numVertices).fill(0);
        const isFriend = Array(numVertices).fill(false);

        adjLists[idx].forEach(({ name }) => {
            isFriend[name.charCodeAt(0) - 65] = true;
        });

        adjLists[idx].forEach(({ name }) => {
            adjLists[name.charCodeAt(0) - 65].forEach(
                ({ name: friendName }) => {
                    const friendIdx = friendName.charCodeAt(0) - 65;
                    if (friendName !== user && !isFriend[friendIdx]) {
                        recommended[friendIdx]++;
                    }
                }
            );
        });

        const recList = recommended
            .map((count, i) => ({ name: String.fromCharCode(i + 65), count }))
            .filter(({ name, count }) => name !== user && count > 0)
            .map(({ name }) => name);

        setRecs(recList);
    };

    const handleSelect = (user) => setSelected(user);

    const handleAdd = (friend) => {
        if (selected && friend) {
            addEdge(selected, friend);
            recommend("A");
            setSelected(null);
        }
    };

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 600;
        canvas.height = 400;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const radius = 30;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const nodeDistance = 150;

        const drawNode = (angle, name) => {
            const x = centerX + nodeDistance * Math.cos(angle);
            const y = centerY + nodeDistance * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "aliceblue";
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "black";
            ctx.font = "2rem Freesentation-9Black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(name, x, y);
        };

        const drawEdge = (angle1, angle2) => {
            const x1 = centerX + nodeDistance * Math.cos(angle1);
            const y1 = centerY + nodeDistance * Math.sin(angle1);
            const x2 = centerX + nodeDistance * Math.cos(angle2);
            const y2 = centerY + nodeDistance * Math.sin(angle2);
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        };

        const drawGraph = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            for (let i = 0; i < graph.numVertices; i++) {
                const angle1 = (2 * Math.PI * i) / graph.numVertices;
                graph.adjLists[i].forEach((node) => {
                    const angle2 =
                        (2 *
                            Math.PI *
                            (node.name.charCodeAt(0) - "A".charCodeAt(0))) /
                        graph.numVertices;
                    drawEdge(angle1, angle2);
                });
            }

            for (let i = 0; i < graph.numVertices; i++) {
                const angle = (2 * Math.PI * i) / graph.numVertices;
                drawNode(angle, String.fromCharCode(i + "A".charCodeAt(0)));
            }
        };
        drawGraph();
    }, [graph]);

    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            * {
            background: white;
            }

            /* WebKit Scrollbar */
            body::-webkit-scrollbar {
                width: 10px;
            }
            body::-webkit-scrollbar-track {
                background: #eaf8f3;
            }
            body::-webkit-scrollbar-thumb {
                background: #77af9c;
            }
            body::-webkit-scrollbar-thumb:hover {
                background: #77af9c;
            }
            /* Firefox Scrollbar (optional) */
            /* Customize for Firefox as needed */
            `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div>
            <div className={styles.container}>
                <p className={styles.subtitle}>Tionlab</p>
                <p className={styles.subsubtitle}>자료구조</p>
                <div className={styles.subcontainer}>
                    <p className={styles.title}>SNS 팔로우/친구 추천 시스템</p>
                    <div>
                        <button
                            className={styles.btn1}
                            onClick={() => handleSelect("A")}
                        >
                            A
                        </button>
                        <button
                            className={styles.btn1}
                            onClick={() => handleSelect("B")}
                        >
                            B
                        </button>
                        <button
                            className={styles.btn1}
                            onClick={() => handleSelect("C")}
                        >
                            C
                        </button>
                        <button
                            className={styles.btn1}
                            onClick={() => handleSelect("D")}
                        >
                            D
                        </button>
                        <button
                            className={styles.btn1}
                            onClick={() => handleSelect("E")}
                        >
                            E
                        </button>
                        <button
                            className={styles.btn1}
                            onClick={() => handleSelect("F")}
                        >
                            F
                        </button>
                    </div>
                    <div>
                        <button
                            className={styles.btn2}
                            onClick={() => handleAdd("A")}
                            disabled={!selected}
                        >
                            {selected ? `${selected} - A` : "-"}
                        </button>
                        <button
                            className={styles.btn2}
                            onClick={() => handleAdd("B")}
                            disabled={!selected}
                        >
                            {selected ? `${selected} - B` : "-"}
                        </button>
                        <button
                            className={styles.btn2}
                            onClick={() => handleAdd("C")}
                            disabled={!selected}
                        >
                            {selected ? `${selected} - C` : "-"}
                        </button>
                        <button
                            className={styles.btn2}
                            onClick={() => handleAdd("D")}
                            disabled={!selected}
                        >
                            {selected ? `${selected} - D` : "-"}
                        </button>
                        <button
                            className={styles.btn2}
                            onClick={() => handleAdd("E")}
                            disabled={!selected}
                        >
                            {selected ? `${selected} - E` : "-"}
                        </button>
                        <button
                            className={styles.btn2}
                            onClick={() => handleAdd("F")}
                            disabled={!selected}
                        >
                            {selected ? `${selected} - F` : "-"}
                        </button>
                    </div>
                    <h1>현재 그래프</h1>
                    <canvas ref={canvasRef} />
                    <h1>A 에게 보여지는 추천 친구 리스트</h1>
                    {recs.length === 0 ? (
                        <a className={styles.friend}>[추천 친구 없음]</a>
                    ) : (
                        recs.map((friend, index) => (
                            <a key={index} className={styles.friend}>
                                [{friend}]
                            </a>
                        ))
                    )}
                    <br />
                    <br />
                    <br />
                    <h1>현재 엣지 상태</h1>
                    <pre>{JSON.stringify(graph.adjLists, null, 3)}</pre>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
