class Tree<T> {
    private _children: Array<Tree<T>>;
    private parent: Tree<T> = null;

    public constructor(public node: T, children: Array<Tree<T>> = []) {
        this._children = children.map(child => {
            child.parent = this;
            return child;
        });
    }

    public depthFirstSearch(cb: (tree: T) => void): void {
        cb(this.node);
        this._children.forEach(child => child.depthFirstSearch(cb));
    }

    public breadthFirstSearch(cb: (tree: T) => void): void {
        cb(this.node);
        const queue = [...this._children];
        while (queue.length) {
            const firstTree = queue.splice(0, 1)[0];
            cb(firstTree.node);
            queue.push(...firstTree._children);
        }
    }

    public bestFirstSearch(point: T): Array<T> {
        if (!this._children.length) {
            return this.node == point ? [this.node] : [];
        }

        const result: Array<T> = [];
        let queue = [...this._children];

        while (
            (queue = queue.sort((a: any, b: any) => a.node - b.node)).length
        ) {
            const firstTree = queue.splice(0, 1)[0];
            if (firstTree._children.length) {
                queue.push(...firstTree._children);
            } else if (firstTree.node === point) {
                result.push(firstTree.node);
                let current: Tree<T> = firstTree;
                while ((current = current.parent)) {
                    result.unshift(current.node);
                }
                break;
            }
        }
        return result;
    }

    public hillClimbingSearch(point: T): Array<T> {
        if (!this._children.length) {
            return this.node == point ? [this.node] : [];
        }
        const result: Array<T> = [];

        const queue = [
            this._children.slice().sort((a: any, b: any) => a.node - b.node)
        ];
        while (queue.length) {
            const lastChild = queue.pop();
            const firstChild = lastChild.splice(0, 1)[0];
            if (lastChild.length) {
                queue.push(lastChild);
            }
            if (firstChild._children.length) {
                queue.push(
                    firstChild._children
                        .slice()
                        .sort((a: any, b: any) => a.node - b.node)
                );
            } else {
                if (firstChild.node === point) {
                    result.push(firstChild.node);
                    let current: Tree<T> = firstChild;
                    while ((current = current.parent)) {
                        result.unshift(current.node);
                    }
                    break;
                }
            }
        }

        return result;
    }
}

/*
// tree shape
     1
   /  \
  3    2
 /\   /|\
4 5  6 7 10
      /\       
     4 9
*/

const tree = new Tree<number>(1, [
    /*  */
    new Tree(3, [
        /*  */
        new Tree(4),
        new Tree(5)
    ]) /*  */,
    new Tree(2, [
        /*  */
        new Tree(6),
        new Tree(7, [
            /*  */
            new Tree(4),
            new Tree(9)
            /*  */
        ]),
        new Tree(10)
    ])
    /*  */
]);

tree.depthFirstSearch(node => {
    console.log(node);
});

tree.breadthFirstSearch(node => {
    console.log(node);
});

const bestPath = tree.bestFirstSearch(4);
console.log(bestPath);

const hillPath = tree.hillClimbingSearch(4);
console.log(hillPath);
