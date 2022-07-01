# API List

Play.block(length, width, height, x = 0, y = 0, z = 0);

Play.cylinder(radius, height, x = 0, y = 0, z = 0);

Play.sphere(radius, x = 0, y = 0, z = 0);

Play.prism(radius, height, sides, x = 0, y = 0, z = 0);

Play.cone(radius, height, semiAngle, x = 0, y = 0, z = 0);

Play.torus(majorRadius, minorRadius, x = 0, y = 0, z = 0);

Play.combine(model1, model2);

Play.cut(model1, model2);

Play.move(model, x, y, z);

Play.rotateX(model, angle);

Play.rotateY(model, angle);

Play.rotateZ(model, angle);

Play.scale(model, scaleFactor);

Play.color(model, colorName);

# Examples

```
let a=Play.块(0.2, 0.3, 0.4, 0, 0, 0)
Play.move(a, 1, 1,0.5);
Play.color(a, 'green');
```

```
let level=19;
let base=400;
let height=20;

let result=Play.block(base, base, height, 0, 0, 0);

for(let i=0; i<level; i += 1) {
base = base*1.05; // 0.91
let newLevel = Play.block(base, base, height, 0, 0, i*height);
result = Play.combine(result, newLevel);
}
Play.color(result, ‘orange');
```

```
let a=Play.block(400, 400, 400, 0, 0, 0);
let b=Play.sphere(180, 120, 120, 400);
let c= Play.cut(a,b);
Play.color(c, 'orange');
```

```
let a=Play.block(100, 100, 100, 0, 0, 0);
for(let i=0;i<5;i += 1) {
    yield* XcUIManager.sleep(1000);
    Play.move(a, 100, 100,0);
    Play.color(a, 'red');

    yield* XcUIManager.sleep(1000);
    Play.move(a, -100, -100,0);
    Play.color(a, 'green');
}
```