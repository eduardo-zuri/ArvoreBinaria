let tree = new BinaryTree();
const binaryTreeContainer = document.querySelector(".binaryTree");

function addNode(value) {
    if (value !== undefined && value !== null) {
        const newNode = tree.insert(value);
        createNode(newNode);
    }
}

function createNode(node) {
    const newNodeElement = document.createElement("div");
    newNodeElement.className = "node";
    newNodeElement.id = `ID${node.id}`;
    newNodeElement.textContent = node.value;
    newNodeElement.level = node.level;

    newNodeElement.addEventListener("click", () => {
        alert(`Altura do nó ${node.value} é ${tree.nodeHeight(node)}`);
    });

    if (node.parentNode) {
        // Correção de comparação: agora compara números matematicamente em vez de texto
        const isLeftChild = node.value < node.parentNode.value;
        const horizontalOffset = 50;
        const verticalOffset = 80;

        const parentNodeElement = document.querySelector(`#ID${node.parentNode.id}`);
        newNodeElement.style.top = `${parentNodeElement.offsetTop + verticalOffset}px`;
        
        if (isLeftChild) {
            newNodeElement.style.left = `${parentNodeElement.offsetLeft - horizontalOffset}px`;
        } else {
            newNodeElement.style.left = `${parentNodeElement.offsetLeft + horizontalOffset}px`;
        }
    } else {
        newNodeElement.style.top = `50px`;
        newNodeElement.style.left = `calc(50% - 25px)`; // Inicia no meio da tela
    }

    binaryTreeContainer.appendChild(newNodeElement);
    check(node);
    if (node.parentNode) { tree.traceLine(node, node.parentNode); }
}

function makeTree() {
    const inputValue = document.getElementById("value").value;
    
    // Filtra para pegar apenas os números (positivos e negativos)
    const matches = inputValue.match(/-?\d+/g);
    
    if (!matches) {
        alert("Por favor, insira apenas números válidos.");
        return;
    }

    const valueArray = matches.map(Number);

    for (let i = 0; i < valueArray.length; i++) {
        setTimeout(() => {
            addNode(valueArray[i]);
        }, 300 * i); // Aumentei um pouco o tempo para animação ficar mais visível
    }
    document.getElementById("value").value = "";
}

function randomizeTree() {
    clearTree();
    const count = Math.floor(Math.random() * 8) + 5; // Gera de 5 a 12 nós aleatórios
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const randomVal = Math.floor(Math.random() * 100); // Números entre 0 e 99
            addNode(randomVal);
        }, 300 * i);
    }
}

function clearTree() {
    binaryTreeContainer.innerHTML = ""; // Limpa a tela
    tree = new BinaryTree(); // Reseta a árvore lógica
    resetNodeId(); // Reseta a contagem de IDs (definido no node.js)
}

function highlight(node, color) {
    const htmlNodeElement = document.querySelector(`#ID${node.id}`);
    if(htmlNodeElement) htmlNodeElement.style.backgroundColor = color;
}

function hide(node) {
    const htmlNodeElement = document.querySelector(`#ID${node.id}`);
    if(htmlNodeElement) htmlNodeElement.style.backgroundColor = "#FFD700";
}

function check(node) {
    let collisionNodes = [];
    tree.check(node.level, collisionNodes);
    if (collisionNodes.length > 1) {
        for (let collisionNode of collisionNodes) {
            if (node.id !== collisionNode.id) {
                if (checkCollision(node, collisionNode)) {
                    let ancestor = tree.findCommonAncestor(node, collisionNode);
                    tree.adjustSubtreeSpacing(ancestor);
                    tree.updateLines(ancestor);
                    tree.checkAll();
                }
            }
        }
    }
}

function checkCollision(node1, node2) {
    const node1Element = document.querySelector(`#ID${node1.id}`);
    const node2Element = document.querySelector(`#ID${node2.id}`);
    if (!node1Element || !node2Element) return false;
    
    let space = 30;

    let left1 = node1Element.offsetLeft - space;
    let right1 = node1Element.offsetLeft + node1Element.offsetWidth + space;

    let left2 = node2Element.offsetLeft - space;
    let right2 = node2Element.offsetLeft + node2Element.offsetWidth + space;

    if (right1 >= left2 && left1 <= right2) {
        return true;
    } else {
        return false;
    }
}

function print() {
    tree.print();
}

function showSize() {
    const size = tree.getSize();
    alert(`O tamanho da árvore é: ${size}`);
}

function showHeight() {
    const result = tree.getHeight();
    alert(`A altura da árvore é: ${result}`);
}