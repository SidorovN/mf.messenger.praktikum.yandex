export function render(root, block) {
    root.appendChild(block.getContent());
    return root;
}
