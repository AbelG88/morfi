/* ===== Morfi Familiar: datos y reglas =====
   Ingredientes: Nombre|unidad|categoría|flags
   Flags: M carne/pescado/fiambre, R carne roja (vaca/cerdo), O vísceras, S mariscos,
          P almidón (papa, batata, mandioca, polenta), L legumbre, G gluten, W cereal/pasta, Z masa madre
   Comidas: Nombre|tipo(A almuerzo, C cena, AC ambas, M merienda)|k si es simple para Dante|Ingred:cantidad por persona|tip
*/
const PROFILES=[
  {k:'a',n:'Abel',c:'#0d9488'},
  {k:'b',n:'Belén',c:'#16a34a'},
  {k:'d',n:'Dante',c:'#d97706'},
  {k:'i',n:'Isa',c:'#0284c7'}
];

const ING_RAW=`
Pollo|g|C|M
Pavita|g|C|M
Carne vacuna|g|C|MR
Carne picada|g|C|MR
Cerdo|g|C|MR
Pescado blanco|g|C|M
Salmón|g|C|M
Atún|g|C|M
Jamón cocido|g|C|M
Camarones|g|C|MS
Mejillones|g|C|MS
Zapallito/Zucchini|g|V|
Zapallo/Calabaza|g|V|
Zanahoria|g|V|
Remolacha|g|V|
Cebolla|g|V|
Morrón|g|V|
Tomate|g|V|
Espinaca|g|V|
Acelga|g|V|
Rúcula|g|V|
Lechuga|g|V|
Brócoli|g|V|
Coliflor|g|V|
Berenjena|g|V|
Hongos|g|V|
Puerro|g|V|
Verdeo|g|V|
Repollo|g|V|
Pepino|g|V|
Chauchas|g|V|
Espárragos|g|V|
Palta|u|V|
Papa|g|V|P
Batata|g|V|P
Banana|u|V|
Fruta de estación|u|V|
Manzana|u|V|
Frutos rojos|g|V|
Ciruelas pasas|g|V|
Huevo|u|L|
Queso semiduro|g|L|
Queso fresco|g|L|
Muzzarella|g|L|
Ricota|g|L|
Queso rallado|g|L|
Yogur natural|g|L|
Crema|ml|L|
Manteca|g|L|
Leche|ml|L|
Lentejas|g|A|L
Garbanzos|g|A|L
Porotos|g|A|L
Hummus|g|A|L
Fideos de legumbres|g|A|LW
Harina de garbanzos|g|A|L
Quinoa|g|A|W
Arroz yamaní|g|A|W
Arroz integral|g|A|W
Mijo|g|A|W
Trigo sarraceno|g|A|W
Amaranto|g|A|W
Polenta|g|A|WP
Fideos sin gluten|g|A|WP
Fideos comunes|g|A|GW
Harina de trigo|g|A|GW
Pan rallado|g|A|GW
Pan de masa madre|u|A|GWZ
Salvado de avena|g|A|GW
Galleta de arroz|u|A|W
Fécula de mandioca|g|A|P
Harina de almendras|g|A|
Frutos secos|g|A|
Nueces|g|A|
Almendras|g|A|
Semillas (mix)|g|A|
Sésamo molido|g|A|
Coco rallado|g|A|
Cacao amargo|g|A|
Levadura nutricional|g|A|
`;

const MEAL_RAW=`
Omelette de zapallitos con queso y ciboulette|AC|k|Huevo:3,Zapallito/Zucchini:100,Queso semiduro:30
Omelette de jamón y queso|AC|k|Huevo:3,Jamón cocido:40,Queso semiduro:30
Omelette de espinaca y queso fresco|AC|-|Huevo:3,Espinaca:80,Queso fresco:40
Omelette de champiñones y cebolla|AC|-|Huevo:3,Hongos:100,Cebolla:40
Omelette de tomate, albahaca y muzzarella|AC|k|Huevo:3,Tomate:80,Muzzarella:40
Omelette de acelga y ricota|AC|-|Huevo:3,Acelga:80,Ricota:40
Omelette de puerro y queso|AC|-|Huevo:3,Puerro:80,Queso semiduro:30
Omelette de brócoli y queso|AC|k|Huevo:3,Brócoli:80,Queso semiduro:30
Omelette de atún y tomate|AC|-|Huevo:3,Atún:60,Tomate:60
Omelette de morrón y cebolla con queso|AC|-|Huevo:3,Morrón:60,Cebolla:40,Queso semiduro:30
Omelette de calabaza asada y queso|AC|k|Huevo:3,Zapallo/Calabaza:100,Queso fresco:40
Revuelto de huevos con vegetales y queso|AC|k|Huevo:3,Zapallito/Zucchini:80,Cebolla:40,Queso fresco:30
Revuelto de huevos con espinaca y queso|AC|-|Huevo:3,Espinaca:80,Queso fresco:30
Revuelto de zapallitos, cebolla y queso|AC|k|Huevo:3,Zapallito/Zucchini:100,Cebolla:40,Queso semiduro:30
Revuelto de berenjena asada y tomate|AC|-|Huevo:3,Berenjena:100,Tomate:60
Revuelto de champiñones y verdeo|AC|-|Huevo:3,Hongos:100,Verdeo:30
Revuelto de tomate y albahaca con queso rallado|AC|k|Huevo:3,Tomate:100,Queso rallado:20
Revuelto de jamón y morrón|AC|-|Huevo:3,Jamón cocido:40,Morrón:60
Revuelto de acelga y queso cremoso|AC|-|Huevo:3,Acelga:100,Queso fresco:40
Revuelto de calabaza y queso con semillas|AC|-|Huevo:3,Zapallo/Calabaza:100,Queso fresco:30,Semillas (mix):10
Huevos poché sobre espinaca salteada con queso|AC|-|Huevo:3,Espinaca:100,Queso rallado:20
Huevos al horno con tomate y morrón (shakshuka)|AC|-|Huevo:3,Tomate:150,Morrón:60,Cebolla:40
Huevos duros rellenos con palta y atún|AC|-|Huevo:3,Palta:0.5,Atún:50
Huevos duros con ensalada de rúcula y queso|AC|-|Huevo:3,Rúcula:50,Queso fresco:40,Tomate:60
Tortilla de papa y cebolla con ensalada|A|k|Huevo:3,Papa:150,Cebolla:50,Lechuga:50,Tomate:60
Tortilla de zapallitos con queso|AC|k|Huevo:3,Zapallito/Zucchini:120,Queso semiduro:30
Tortilla de espinaca y cebolla con ensalada|AC|-|Huevo:3,Espinaca:100,Cebolla:50,Lechuga:50,Tomate:60
Tortilla de acelga y queso|AC|-|Huevo:3,Acelga:100,Queso semiduro:30
Tortilla de calabaza y queso|AC|k|Huevo:3,Zapallo/Calabaza:120,Queso fresco:30
Tortilla de brócoli y cebolla|AC|-|Huevo:3,Brócoli:100,Cebolla:40
Tortilla de berenjena y tomate|AC|-|Huevo:3,Berenjena:100,Tomate:60
Frittata de verduras al horno|AC|-|Huevo:3,Zapallito/Zucchini:60,Morrón:40,Cebolla:40,Queso rallado:20
Frittata de zucchini y muzzarella|AC|k|Huevo:3,Zapallito/Zucchini:100,Muzzarella:40
Frittata de puerro y hongos|AC|-|Huevo:3,Puerro:60,Hongos:80
Budín salado de acelga con queso y harina de almendras|AC|k|Huevo:2,Acelga:120,Queso semiduro:40,Harina de almendras:30
Budín de zapallitos y queso|AC|k|Huevo:2,Zapallito/Zucchini:120,Queso semiduro:40,Harina de almendras:20
Budín de espinaca y ricota|AC|-|Huevo:2,Espinaca:100,Ricota:50,Harina de almendras:20
Soufflé de coliflor y queso|AC|-|Huevo:2,Coliflor:150,Queso rallado:30
Soufflé de calabaza y queso|AC|k|Huevo:2,Zapallo/Calabaza:150,Queso rallado:30
Pastel de zapallo con queso fresco derretido|AC|k|Zapallo/Calabaza:200,Queso fresco:50,Huevo:2
Ensalada de rúcula, palta, huevo duro y queso|AC|-|Rúcula:50,Palta:0.5,Huevo:2,Queso fresco:40
Ensalada de espinaca, nueces y queso fresco|AC|-|Espinaca:60,Nueces:15,Queso fresco:50,Huevo:1,Manzana:0.5
Ensalada de repollo y zanahoria con huevo duro|AC|-|Repollo:80,Zanahoria:50,Huevo:2,Semillas (mix):10
Ensalada caprese con huevo duro|AC|k|Tomate:150,Muzzarella:80,Huevo:1
Ensalada tibia de brócoli, huevo y semillas|AC|-|Brócoli:120,Huevo:2,Semillas (mix):10,Queso rallado:15
Ensalada de pepino, palta y queso fresco|AC|-|Pepino:100,Palta:0.5,Queso fresco:60,Huevo:1
Ensalada de remolacha, queso y nueces|AC|-|Remolacha:100,Queso fresco:50,Nueces:15,Rúcula:30
Ensalada de coliflor asada con huevo y semillas|AC|-|Coliflor:150,Huevo:2,Semillas (mix):10
Ensalada de chauchas, huevo y queso rallado|AC|-|Chauchas:100,Huevo:2,Queso rallado:20,Tomate:60
Ensalada tibia de hongos con rúcula y huevo poché|AC|-|Hongos:120,Rúcula:40,Huevo:2
Ensalada completa (huevo, palta, papa fría, tomate)|A|-|Huevo:2,Palta:0.5,Papa:100,Tomate:80,Lechuga:50
Ensalada de atún, huevo y palta|AC|-|Atún:100,Huevo:2,Palta:0.5,Lechuga:50,Tomate:60
Ensalada de pollo, palta y rúcula|AC|-|Pollo:120,Palta:0.5,Rúcula:50,Tomate:60,Semillas (mix):10
Ensalada de salmón, pepino y palta|AC|-|Salmón:120,Pepino:80,Palta:0.5,Lechuga:40
Ensalada de lechuga, tomate, palta y huevo + 1/4 de tortilla de papas|A|-|Lechuga:60,Tomate:80,Palta:0.5,Huevo:2,Papa:50
Sopa crema de zapallo con queso y huevos poché|C|k|Zapallo/Calabaza:150,Zanahoria:50,Cebolla:40,Queso semiduro:30,Huevo:2
Sopa crema de zanahoria con huevo|C|-|Zanahoria:150,Cebolla:40,Huevo:2,Crema:30
Sopa crema de brócoli y queso|C|-|Brócoli:150,Cebolla:40,Queso semiduro:30,Huevo:1
Sopa crema de espinaca con huevo duro|C|-|Espinaca:120,Cebolla:40,Crema:30,Huevo:2
Sopa crema de coliflor y puerro con queso rallado|C|-|Coliflor:150,Puerro:50,Queso rallado:20,Huevo:1
Sopa de verduras con huevo y queso|C|-|Zapallito/Zucchini:80,Zanahoria:50,Puerro:40,Huevo:2,Queso rallado:20
Sopa de calabaza y manzana con semillas|C|-|Zapallo/Calabaza:150,Manzana:0.5,Semillas (mix):10,Huevo:1
Crema de tomate con muzzarella y huevo|C|k|Tomate:200,Cebolla:40,Muzzarella:40,Huevo:1
Sopa de pollo y verduras|AC|k|Pollo:120,Zanahoria:50,Zapallito/Zucchini:60,Puerro:30
Berenjenas rellenas de queso y tomate|AC|-|Berenjena:200,Muzzarella:60,Tomate:60,Cebolla:30
Zapallitos rellenos de queso y huevo|AC|-|Zapallito/Zucchini:200,Queso semiduro:40,Huevo:1,Cebolla:30
Zapallitos rellenos de carne picada|A|-|Zapallito/Zucchini:200,Carne picada:120,Cebolla:40,Queso rallado:20
Morrones rellenos de huevo y queso|AC|-|Morrón:150,Huevo:2,Queso semiduro:30
Champiñones rellenos de espinaca y queso|AC|-|Hongos:150,Espinaca:60,Queso rallado:30
Tomates rellenos con atún y huevo|AC|-|Tomate:200,Atún:60,Huevo:1
Coliflor gratinada con queso|AC|k|Coliflor:200,Queso semiduro:40,Crema:30,Huevo:1
Brócoli gratinado con crema y queso|AC|-|Brócoli:200,Crema:30,Queso rallado:30,Huevo:1
Espinacas a la crema gratinadas con huevo|AC|-|Espinaca:150,Crema:40,Queso rallado:20,Huevo:2
Zapallo gratinado con queso|AC|k|Zapallo/Calabaza:200,Queso semiduro:40,Huevo:1
Berenjenas rellenas de carne picada|A|-|Berenjena:200,Carne picada:120,Tomate:60,Queso rallado:20
Zapallitos rellenos de pollo y queso|AC|-|Zapallito/Zucchini:200,Pollo:100,Queso semiduro:30
Cebollas rellenas con queso y semillas|AC|-|Cebolla:200,Queso semiduro:40,Semillas (mix):10
Canelones de panqueque de huevo rellenos de espinaca y ricota|AC|k|Huevo:2,Espinaca:80,Ricota:60,Tomate:80
Salteado de zucchini, berenjena y morrón con queso y huevo|AC|-|Zapallito/Zucchini:100,Berenjena:100,Morrón:50,Cebolla:50,Queso semiduro:30,Huevo:2
Salteado de brócoli, zapallo y zapallitos con huevo y queso|AC|-|Brócoli:80,Zapallo/Calabaza:60,Zapallito/Zucchini:60,Huevo:2,Queso rallado:20
Wok de vegetales con huevo revuelto y semillas|AC|-|Zapallito/Zucchini:80,Brócoli:80,Zanahoria:50,Huevo:2,Semillas (mix):10
Salteado de hongos, espinaca y huevo|AC|-|Hongos:120,Espinaca:80,Huevo:2,Cebolla:40
Salteado de coliflor y puerro con queso|AC|-|Coliflor:150,Puerro:50,Queso fresco:40,Huevo:1
Salteado de repollo, zanahoria y huevo estilo oriental|AC|-|Repollo:100,Zanahoria:60,Huevo:2,Verdeo:20
Salteado de chauchas, tomate y huevo|AC|-|Chauchas:120,Tomate:80,Huevo:2,Cebolla:30
Arroz de coliflor con huevo y vegetales|AC|-|Coliflor:150,Huevo:2,Zanahoria:40,Verdeo:20
Fideos de zucchini con salsa de tomate y queso|AC|-|Zapallito/Zucchini:200,Tomate:100,Queso rallado:30,Huevo:1
Vegetales horneados con tortilla de papa|AC|k|Zapallito/Zucchini:100,Berenjena:80,Cebolla:50,Papa:100,Huevo:2
Tarta sin gluten de acelga y muzzarella|AC|-|Acelga:120,Muzzarella:60,Huevo:2,Harina de almendras:40,Cebolla:40
Tarta sin gluten de calabaza y queso|AC|k|Zapallo/Calabaza:120,Queso semiduro:40,Huevo:2,Harina de almendras:40
Tarta sin gluten de brócoli y queso|AC|-|Brócoli:120,Queso semiduro:40,Huevo:2,Harina de almendras:40
Tarta sin gluten de espinaca y ricota|AC|-|Espinaca:100,Ricota:60,Huevo:2,Harina de almendras:40
Tarta sin gluten de cebolla y queso|AC|k|Cebolla:120,Queso semiduro:50,Huevo:2,Harina de almendras:40
Tarta sin gluten de puerro y queso|AC|-|Puerro:100,Queso semiduro:50,Huevo:2,Harina de almendras:40
Tarta sin gluten de tomate y muzzarella|AC|k|Tomate:120,Muzzarella:60,Huevo:2,Harina de almendras:40
Tarta sin gluten de zucchini y queso|AC|-|Zapallito/Zucchini:120,Queso semiduro:40,Huevo:2,Harina de almendras:40
Hamburguesas de calabaza y queso con ensalada|AC|k|Zapallo/Calabaza:120,Queso semiduro:40,Huevo:1,Harina de almendras:25,Lechuga:40
Hamburguesas de espinaca y ricota|AC|-|Espinaca:100,Ricota:50,Huevo:1,Harina de almendras:25,Tomate:60
Hamburguesas de berenjena y queso|AC|-|Berenjena:120,Queso semiduro:40,Huevo:1,Harina de almendras:25
Hamburguesas de zanahoria y queso|AC|k|Zanahoria:120,Queso semiduro:40,Huevo:1,Harina de almendras:25,Lechuga:40
Milanesas de berenjena rebozadas con harina de almendras|AC|k|Berenjena:150,Huevo:1,Harina de almendras:40,Tomate:60,Queso rallado:15
Milanesas de zucchini al horno|AC|k|Zapallito/Zucchini:150,Huevo:1,Harina de almendras:40,Queso rallado:15,Lechuga:40
Milanesas de coliflor al horno|AC|k|Coliflor:150,Huevo:1,Harina de almendras:40,Queso rallado:15
Croquetas de brócoli y queso al horno|AC|k|Brócoli:100,Queso semiduro:40,Huevo:1,Harina de almendras:30
Croquetas de calabaza y queso|AC|k|Zapallo/Calabaza:120,Queso semiduro:40,Huevo:1,Harina de almendras:30
Pizza de coliflor con muzzarella y tomate|AC|k|Coliflor:150,Huevo:1,Muzzarella:60,Tomate:60,Queso rallado:15
Pizza de fainá con queso y vegetales rallados|AC|k|Harina de garbanzos:70,Queso semiduro:40,Zanahoria:40,Zapallito/Zucchini:40
Panqueques salados de harina de almendras con espinaca y queso|AC|k|Huevo:2,Harina de almendras:30,Espinaca:80,Queso fresco:50
Pizza de zucchini con muzzarella|AC|k|Zapallito/Zucchini:150,Huevo:1,Muzzarella:60,Tomate:60,Harina de almendras:20
Hamburguesas de lentejas con ensalada|AC|k|Lentejas:70,Huevo:1,Cebolla:30,Zanahoria:40,Lechuga:40
Hamburguesas de garbanzos con rúcula y tomate|AC|k|Garbanzos:70,Huevo:1,Rúcula:30,Tomate:60
Hamburguesas de porotos y calabaza|AC|-|Porotos:70,Zapallo/Calabaza:60,Huevo:1,Cebolla:30
Hamburguesas de quinoa y zanahoria|AC|k|Quinoa:60,Zanahoria:60,Huevo:1,Queso rallado:15,Lechuga:40
Hamburguesas de mijo y zanahoria con ensalada|A|k|Mijo:60,Zanahoria:80,Huevo:1,Cebolla:50,Lechuga:40
Hamburguesas de lentejas con salteado de zucchini|AC|-|Lentejas:70,Huevo:1,Zapallito/Zucchini:100
Falafel al horno con hummus y ensalada|AC|-|Garbanzos:70,Hummus:30,Pepino:60,Tomate:60,Huevo:1
Guiso de lentejas con zapallo|A|-|Lentejas:80,Zapallo/Calabaza:100,Zanahoria:50,Cebolla:50,Morrón:30
Chili vegetariano de porotos y tomate|AC|-|Porotos:80,Tomate:150,Morrón:50,Cebolla:50
Dahl de lentejas con arroz yamaní|AC|-|Lentejas:70,Arroz yamaní:60,Cebolla:40,Tomate:80
Curry de garbanzos y vegetales con arroz yamaní|AC|-|Garbanzos:60,Arroz yamaní:60,Zapallito/Zucchini:80,Zanahoria:50,Cebolla:50
Curry de calabaza y garbanzos|AC|-|Zapallo/Calabaza:150,Garbanzos:60,Cebolla:50,Espinaca:40
Ensalada tibia de lentejas con huevo y queso|AC|-|Lentejas:70,Huevo:1,Queso fresco:40,Tomate:60,Rúcula:30
Ensalada de garbanzos, pepino y queso fresco|AC|-|Garbanzos:70,Pepino:80,Queso fresco:50,Tomate:60
Ensalada de huevo, zanahoria rallada, lentejas y quinoa|AC|-|Huevo:2,Zanahoria:80,Lentejas:50,Quinoa:40
Salteado de brócoli, zapallo, zapallitos y garbanzos con huevo|AC|-|Brócoli:80,Zapallo/Calabaza:60,Zapallito/Zucchini:60,Garbanzos:50,Huevo:1,Cebolla:40
Wok de vegetales y quinoa|A|-|Quinoa:60,Zapallito/Zucchini:100,Brócoli:80,Zanahoria:50,Cebolla:50
Quinoa con verduras salteadas y huevo|AC|-|Quinoa:60,Zanahoria:50,Zapallito/Zucchini:60,Huevo:1,Cebolla:30
Bowl de quinoa, palta, huevo y tomate|AC|-|Quinoa:60,Palta:0.5,Huevo:1,Tomate:80,Rúcula:30
Tabulé de quinoa con pepino, tomate y queso fresco|AC|-|Quinoa:60,Pepino:60,Tomate:80,Queso fresco:40
Quinoa con espinaca y queso gratinada|AC|k|Quinoa:60,Espinaca:80,Queso rallado:30,Huevo:1
Risotto de hongos con arroz yamaní|A|-|Arroz yamaní:70,Hongos:100,Cebolla:50,Queso rallado:20
Arroz yamaní con vegetales y huevo|AC|k|Arroz yamaní:70,Zanahoria:40,Zapallito/Zucchini:60,Huevo:1
Arroz yamaní con espinaca y queso|AC|k|Arroz yamaní:70,Espinaca:80,Queso fresco:40
Bowl de arroz yamaní, palta y huevo|AC|k|Arroz yamaní:70,Palta:0.5,Huevo:1,Pepino:50
Mijo con calabaza y queso|AC|-|Mijo:60,Zapallo/Calabaza:100,Queso semiduro:30
Trigo sarraceno con hongos y huevo|AC|-|Trigo sarraceno:60,Hongos:100,Huevo:1,Cebolla:30
Amaranto con verduras y queso|AC|-|Amaranto:50,Zapallito/Zucchini:80,Queso semiduro:30,Tomate:60
Polenta cremosa con queso y salsa de tomate|AC|k|Polenta:70,Queso semiduro:40,Tomate:100,Cebolla:30
Polenta con hongos y queso|AC|-|Polenta:70,Hongos:100,Queso rallado:20
Fideos de legumbres con salsa de tomate y queso|AC|k|Fideos de legumbres:80,Tomate:120,Queso rallado:20
Fideos de legumbres con ralladito nutritivo y huevo|AC|k|Fideos de legumbres:80,Huevo:1,Sésamo molido:15,Levadura nutricional:10,Queso rallado:15
Fideos sin gluten con manteca y queso|AC|k|Fideos sin gluten:80,Manteca:10,Queso rallado:25
Fideos sin gluten con brócoli y crema|AC|-|Fideos sin gluten:80,Brócoli:80,Crema:40,Queso rallado:20
Fideos sin gluten con salsa de tomate y albahaca|AC|k|Fideos sin gluten:80,Tomate:120,Queso rallado:20
Ñoquis de mandioca y queso con salsa de tomate|AC|k|Fécula de mandioca:60,Queso semiduro:30,Huevo:1,Tomate:100
Ñoquis de calabaza con fécula de mandioca y queso|AC|k|Zapallo/Calabaza:100,Fécula de mandioca:50,Queso rallado:20,Huevo:1
Chipá saludable con ensalada|AC|k|Fécula de mandioca:50,Batata:40,Ricota:20,Huevo:1,Queso semiduro:30,Lechuga:40,Tomate:50
Pollo al horno con bastones de calabaza|A|k|Pollo:200,Zapallo/Calabaza:150,Cebolla:50
Pollo grillado con vegetales al vapor|AC|k|Pollo:180,Zapallito/Zucchini:100,Zanahoria:50
Suprema de pollo grillada con ensalada|AC|k|Pollo:180,Lechuga:50,Tomate:60,Zanahoria:40
Pollo al limón con zapallitos|AC|-|Pollo:180,Zapallito/Zucchini:120,Cebolla:30
Pollo a la cacerola con tomate y morrón|AC|-|Pollo:180,Tomate:100,Morrón:50,Cebolla:40
Wok de vegetales con pollo|AC|-|Pollo:150,Zapallito/Zucchini:100,Brócoli:80,Zanahoria:50,Cebolla:50
Pollo con espinaca a la crema|AC|-|Pollo:180,Espinaca:100,Crema:40
Pollo relleno con espinaca y queso|AC|-|Pollo:180,Espinaca:60,Queso semiduro:30
Pollo al curry suave con coliflor|AC|-|Pollo:150,Coliflor:120,Cebolla:40,Crema:30
Brochettes de pollo y vegetales|AC|-|Pollo:180,Morrón:60,Cebolla:50,Zapallito/Zucchini:60
Pollo con champiñones a la crema|AC|-|Pollo:180,Hongos:100,Crema:40
Tiritas de pollo salteadas con vegetales|AC|-|Pollo:150,Morrón:50,Cebolla:40,Brócoli:60
Pollo desmenuzado con puré mixto y 2 huevos duros|AC|k|Pollo:150,Papa:100,Zapallo/Calabaza:100,Huevo:2
Bastoncitos de pollo al horno con puré de calabaza|AC|k|Pollo:150,Huevo:1,Harina de almendras:30,Zapallo/Calabaza:150
Milanesas de pollo al horno con ensalada|AC|k|Pollo:150,Huevo:1,Harina de almendras:30,Lechuga:50,Tomate:60
Pollo al verdeo con zanahoria|AC|-|Pollo:180,Verdeo:40,Zanahoria:80,Crema:30
Pollo con berenjenas y tomate|AC|-|Pollo:180,Berenjena:100,Tomate:80
Pollo gratinado con brócoli y queso|AC|k|Pollo:180,Brócoli:100,Queso semiduro:40
Albóndigas de pollo y zucchini con salsa de tomate|AC|k|Pollo:150,Zapallito/Zucchini:60,Huevo:1,Tomate:100
Hamburguesas de pollo con tortilla de papas|A|k|Pollo:150,Papa:120,Huevo:2,Cebolla:50
Hamburguesas de pollo con ensalada|AC|k|Pollo:150,Huevo:1,Lechuga:50,Tomate:60
Pollo al horno con vegetales asados|AC|-|Pollo:200,Zapallito/Zucchini:100,Zapallo/Calabaza:50,Cebolla:50
Pavita al horno con zanahoria y zapallitos|AC|-|Pavita:180,Zanahoria:80,Zapallito/Zucchini:80
Pavita grillada con ensalada de rúcula y palta|AC|-|Pavita:160,Rúcula:50,Tomate:60,Palta:0.5
Pollo con ensalada de palta y huevo|AC|-|Pollo:150,Palta:0.5,Huevo:1,Lechuga:50
Pollo salteado con puerro y hongos|AC|-|Pollo:160,Puerro:50,Hongos:80
Muslo de pollo al horno con coliflor|AC|-|Pollo:200,Coliflor:120,Cebolla:40
Pollo con puré de calabaza|AC|k|Pollo:160,Zapallo/Calabaza:150,Manteca:10
Tarta de pollo y verdeo sin gluten|AC|-|Pollo:100,Verdeo:40,Huevo:2,Harina de almendras:40
Pollo y vegetales en papillote|AC|-|Pollo:180,Zanahoria:50,Zapallito/Zucchini:60,Cebolla:30
Pescado al horno a la cebolla con crema y puré mixto|AC|k|Pescado blanco:200,Cebolla:80,Crema:30,Papa:80,Zapallo/Calabaza:80
Merluza al horno con revuelto de zapallitos y huevo|AC|-|Pescado blanco:200,Zapallito/Zucchini:100,Huevo:2
Pescado a la cacerola con salsa de tomate, cebolla y morrón|AC|-|Pescado blanco:200,Tomate:120,Cebolla:50,Morrón:50
Pescado al horno sobre cebollas y morrones asados|AC|-|Pescado blanco:200,Cebolla:100,Morrón:80
Merluza al limón con brócoli|AC|-|Pescado blanco:200,Brócoli:100
Brótola al verdeo con crema|AC|-|Pescado blanco:200,Verdeo:40,Crema:30
Pescado en papillote con vegetales|AC|-|Pescado blanco:200,Zapallito/Zucchini:80,Zanahoria:50,Tomate:60
Pescado con salsa de espinaca|AC|-|Pescado blanco:200,Espinaca:100,Crema:30
Pescado gratinado con queso y tomate|AC|k|Pescado blanco:200,Tomate:80,Queso rallado:30
Bastones de merluza al horno con ensalada|AC|k|Pescado blanco:180,Huevo:1,Harina de almendras:30,Lechuga:40,Tomate:50
Hamburguesas de pescado con ensalada|AC|-|Pescado blanco:150,Huevo:1,Harina de almendras:25,Lechuga:40
Salmón al horno con espárragos|AC|-|Salmón:160,Espárragos:100
Salmón con brócoli y limón|AC|-|Salmón:160,Brócoli:100
Salmón con crema de espinaca|AC|-|Salmón:160,Espinaca:100,Crema:30
Salmón grillado con ensalada de pepino y palta|AC|-|Salmón:160,Pepino:60,Palta:0.5
Tarta de atún y tomate sin gluten|AC|-|Atún:80,Tomate:80,Huevo:2,Harina de almendras:40
Pescado con puré de calabaza|AC|k|Pescado blanco:180,Zapallo/Calabaza:150,Manteca:10
Merluza con ensalada de rúcula y tomate|AC|-|Pescado blanco:180,Rúcula:40,Tomate:60
Camarones salteados con zapallitos|AC|-|Camarones:150,Zapallito/Zucchini:100
Mejillones a la provenzal con ensalada|AC|-|Mejillones:200,Tomate:60,Rúcula:30
Tortilla de atún y espinaca|AC|-|Huevo:3,Atún:60,Espinaca:60
Milanesas de carne al horno con ensalada de rúcula y huevo|A|k|Carne vacuna:150,Huevo:2,Harina de almendras:30,Rúcula:40,Zanahoria:50
Hamburguesas caseras con zapallo al horno y queso|A|k|Carne picada:150,Zapallo/Calabaza:150,Queso semiduro:30,Huevo:1
Pastel de papa o zapallo con carne picada y huevo duro|A|k|Carne picada:150,Papa:150,Huevo:1,Cebolla:50
Asado o vacío con ensalada de zanahoria, huevo y palta|A|k|Carne vacuna:200,Zanahoria:80,Huevo:1,Palta:0.5
Costillitas de cerdo con tortilla de zapallitos|A|-|Cerdo:200,Zapallito/Zucchini:150,Huevo:2
Milanesa de cerdo con zanahoria rallada y huevo|A|-|Cerdo:150,Harina de almendras:30,Zanahoria:80,Huevo:2
Tortilla de espinaca con churrasquito de carne|A|-|Espinaca:100,Huevo:2,Carne vacuna:120,Cebolla:50
Bife a la plancha con ensalada completa|A|k|Carne vacuna:180,Lechuga:50,Tomate:60,Huevo:1
Albóndigas de carne con salsa de tomate|A|k|Carne picada:150,Huevo:1,Tomate:120,Cebolla:40
Carne al horno con vegetales asados|A|-|Carne vacuna:180,Zapallito/Zucchini:100,Cebolla:50,Zapallo/Calabaza:50
Lomo de cerdo al horno con coliflor|A|-|Cerdo:180,Coliflor:120,Cebolla:40
Pastel de berenjena y carne picada|A|-|Carne picada:150,Berenjena:120,Tomate:60,Queso rallado:20
Churrasquitos con ensalada de repollo y zanahoria|A|k|Carne vacuna:160,Repollo:60,Zanahoria:50
Carne picada salteada con zapallitos|A|-|Carne picada:150,Zapallito/Zucchini:120,Cebolla:40
Hamburguesa de carne con palta y huevo|A|k|Carne picada:150,Palta:0.5,Huevo:1,Lechuga:40
Colita de cuadril al horno con calabaza|A|-|Carne vacuna:180,Zapallo/Calabaza:120,Cebolla:40
Bondiola de cerdo braseada con repollo y manzana|A|-|Cerdo:180,Repollo:100,Manzana:0.5
Cerdo salteado con vegetales estilo wok|A|-|Cerdo:150,Zapallito/Zucchini:80,Brócoli:60,Zanahoria:40
Carne al horno con puré mixto|A|k|Carne vacuna:160,Papa:100,Zapallo/Calabaza:100
Churrasco con tortilla de papa|A|-|Carne vacuna:160,Papa:120,Huevo:2
Lasaña de berenjena y carne|A|-|Berenjena:150,Carne picada:120,Tomate:80,Muzzarella:40
Fideos con salsa de tomate y queso rallado|AC|k|Fideos comunes:80,Tomate:120,Queso rallado:20
Fideos con manteca y queso|AC|k|Fideos comunes:80,Manteca:10,Queso rallado:25
Fideos con ralladito nutritivo y huevo duro|AC|k|Fideos comunes:80,Huevo:1,Sésamo molido:15,Levadura nutricional:10,Queso rallado:15
Fideos con pollo desmenuzado y crema|AC|k|Fideos comunes:80,Pollo:80,Crema:30
Fideos con albóndigas y salsa|AC|k|Fideos comunes:80,Carne picada:80,Tomate:100
Fideos con brócoli y queso|AC|k|Fideos comunes:80,Brócoli:60,Queso rallado:25
Fideos con salsa blanca de espinaca|AC|-|Fideos comunes:80,Espinaca:60,Crema:40,Queso rallado:20
Milanesas de pollo con puré de papa|AC|k|Pollo:150,Huevo:1,Pan rallado:30,Papa:150,Manteca:10
Milanesas de carne con puré mixto|A|k|Carne vacuna:150,Huevo:1,Pan rallado:30,Papa:100,Zapallo/Calabaza:100
Milanesas de pescado al horno con puré|AC|k|Pescado blanco:150,Huevo:1,Pan rallado:30,Papa:150
Nuggets caseros de pollo con puré de calabaza|AC|k|Pollo:150,Huevo:1,Pan rallado:30,Zapallo/Calabaza:150
Nuggets de pollo rebozados con sésamo y arroz|AC|k|Pollo:150,Huevo:1,Sésamo molido:15,Arroz integral:70
Arroz con pollo y verduras|AC|k|Arroz integral:70,Pollo:120,Zanahoria:50,Zapallito/Zucchini:50
Arroz con huevo y queso|AC|k|Arroz integral:70,Huevo:2,Queso rallado:20
Arroz con atún y tomate|AC|-|Arroz integral:70,Atún:60,Tomate:80
Pastel de papa con carne y queso gratinado|A|k|Papa:150,Carne picada:120,Queso rallado:20
Pastel de papa y espinaca con queso|AC|k|Papa:150,Espinaca:60,Queso semiduro:30,Huevo:1
Puré mixto con huevo duro y ensalada|AC|k|Papa:100,Zapallo/Calabaza:100,Huevo:2,Lechuga:40
Puré de calabaza con pollo desmenuzado|AC|k|Zapallo/Calabaza:150,Pollo:120,Manteca:10
Tarta de jamón y queso con masa casera|AC|k|Harina de trigo:60,Huevo:2,Jamón cocido:40,Queso semiduro:40
Tarta de verduras con masa casera|AC|k|Harina de trigo:60,Huevo:2,Zapallito/Zucchini:80,Queso semiduro:40
Empanadas de verdura y queso al horno|AC|k|Harina de trigo:70,Acelga:60,Queso semiduro:40,Cebolla:30
Empanadas de carne al horno|AC|k|Harina de trigo:70,Carne picada:80,Cebolla:40,Huevo:1
Pizza casera con muzzarella y tomate|AC|k|Harina de trigo:80,Muzzarella:60,Tomate:60
Panqueques salados con jamón y queso|AC|k|Harina de trigo:40,Huevo:1,Leche:100,Jamón cocido:30,Queso semiduro:30
Panqueques de espinaca y ricota|AC|k|Harina de trigo:40,Huevo:1,Leche:100,Espinaca:60,Ricota:50
Canelones de pollo y espinaca|AC|k|Harina de trigo:40,Huevo:1,Pollo:80,Espinaca:50,Tomate:80
Tostadas de pan casero con huevo y palta|AC|k|Pan de masa madre:2,Huevo:2,Palta:0.5
Sándwich de pan casero con pollo y queso|AC|-|Pan de masa madre:2,Pollo:80,Queso semiduro:30,Tomate:50
Sándwich tostado de jamón y queso con ensalada|AC|k|Pan de masa madre:2,Jamón cocido:40,Queso semiduro:30,Lechuga:30
Hamburguesas de pollo y zanahoria con arroz|AC|k|Pollo:120,Zanahoria:40,Huevo:1,Arroz integral:60
Croquetas de pollo y queso al horno|AC|k|Pollo:100,Queso semiduro:30,Huevo:1,Pan rallado:25,Lechuga:30
Croquetas de papa y queso al horno|AC|k|Papa:150,Queso semiduro:40,Huevo:1,Pan rallado:20
Pollo con arroz y huevo duro|AC|k|Pollo:120,Arroz integral:60,Huevo:1
Puré de papa con carne picada y queso|AC|k|Papa:150,Carne picada:100,Queso rallado:20
Tortilla de papa con jamón|A|k|Huevo:3,Papa:120,Jamón cocido:30
Omelette de jamón y queso con puré|AC|k|Huevo:3,Jamón cocido:30,Queso semiduro:30,Papa:100
Pastel de zapallo y carne picada|A|k|Zapallo/Calabaza:150,Carne picada:100,Huevo:1
Fideos de legumbres con pollo y crema|AC|k|Fideos de legumbres:80,Pollo:80,Crema:30
Fideos de legumbres con albóndigas|AC|k|Fideos de legumbres:80,Carne picada:80,Tomate:100
Arroz con zapallitos y queso|AC|k|Arroz integral:70,Zapallito/Zucchini:60,Queso semiduro:30
Polenta con carne picada y queso|AC|k|Polenta:70,Carne picada:100,Queso semiduro:30,Tomate:60
Panqueques de calabaza y queso|AC|k|Harina de trigo:40,Huevo:1,Leche:100,Zapallo/Calabaza:60,Queso semiduro:30
Pizzetas de zucchini y queso|AC|k|Zapallito/Zucchini:120,Huevo:1,Queso rallado:20,Muzzarella:40,Tomate:50
Pechuga a la milanesa con arroz yamaní|AC|k|Pollo:150,Huevo:1,Pan rallado:30,Arroz yamaní:60
Tarta de pollo y queso con masa casera|AC|k|Harina de trigo:60,Huevo:2,Pollo:80,Queso semiduro:40
Ñoquis de papa con salsa de tomate y queso|AC|k|Papa:150,Harina de trigo:40,Huevo:1,Tomate:100,Queso rallado:20
Sopa de fideos con pollo y verduras|AC|k|Fideos comunes:50,Pollo:100,Zanahoria:50,Zapallito/Zucchini:40
Huevos revueltos con queso fresco y 1 fruta|M|k|Huevo:2,Queso fresco:30,Fruta de estación:1
Pancake de banana y coco|M|k|Banana:1,Huevo:2,Coco rallado:20
2 huevos duros con 5 nueces y 1 fruta|M|-|Huevo:2,Nueces:15,Fruta de estación:1
Tostada de masa madre con palta y huevo|M|k|Pan de masa madre:1,Palta:0.5,Huevo:1
Yogur natural con fruta, frutos secos y semillas|M|k|Yogur natural:150,Fruta de estación:1,Frutos secos:15,Semillas (mix):10
Pancake salado de avena relleno de palta o queso|M|k|Huevo:1,Salvado de avena:15,Palta:0.5,Queso fresco:20
Chipá saludable (2 unidades) con fruta|M|k|Fécula de mandioca:40,Batata:40,Ricota:15,Huevo:1,Queso semiduro:15,Fruta de estación:1
Budín de coco y zanahoria|M|k|Zanahoria:40,Coco rallado:30,Huevo:1,Manteca:10
Brownie sin harinas con huevo duro|M|k|Cacao amargo:12,Manteca:20,Huevo:2,Coco rallado:5
Pancitos sin harina con palta|M|k|Huevo:1,Yogur natural:15,Harina de almendras:30,Palta:0.5
Crackers de semillas con queso|M|k|Semillas (mix):25,Queso semiduro:30
Talitas de queso (garbanzo y almendras)|M|k|Harina de garbanzos:25,Harina de almendras:25,Queso semiduro:15,Huevo:1
Galleta de arroz con hummus y huevo|M|-|Galleta de arroz:2,Hummus:30,Huevo:1
Trufas de avena, ciruela y coco|M|k|Salvado de avena:15,Ciruelas pasas:30,Coco rallado:15,Harina de almendras:15
Infusión con crema y tostada con palta y huevo|M|-|Crema:15,Pan de masa madre:1,Palta:0.5,Huevo:1
Frutos secos con queso gouda y huevo duro|M|-|Frutos secos:20,Queso semiduro:30,Huevo:1
Yogur natural con frutos rojos y coco|M|k|Yogur natural:150,Frutos rojos:50,Coco rallado:10
Pancake de coco y huevo con fruta|M|k|Huevo:2,Coco rallado:30,Fruta de estación:1
Huevos duros con palta|M|-|Huevo:2,Palta:0.5
Tostada de palta y queso fresco|M|-|Pan de masa madre:1,Palta:0.5,Queso fresco:30
Manzana al horno con nueces|M|-|Manzana:1,Nueces:15
Banana con yogur y semillas|M|k|Banana:1,Yogur natural:100,Semillas (mix):10
Muffins de zanahoria y coco sin harina|M|k|Zanahoria:50,Coco rallado:30,Huevo:1,Harina de almendras:20
Queso fresco con palta y semillas|M|-|Queso fresco:50,Palta:0.5,Semillas (mix):10
Tortilla de queso a la plancha|M|k|Huevo:2,Queso semiduro:30
Palitos de zanahoria con hummus|M|-|Zanahoria:100,Hummus:40
Budín de banana y nueces sin harina|M|k|Banana:1,Huevo:2,Harina de almendras:30,Nueces:10
Ricota con frutos rojos y almendras|M|-|Ricota:80,Frutos rojos:50,Almendras:10
Pan chato de semillas con queso|M|-|Semillas (mix):20,Queso fresco:40,Huevo:1
Frutos secos y manzana|M|-|Frutos secos:20,Manzana:1
`;

/* ===== Reglas por perfil (a=Abel b=Belén d=Dante i=Isa) ===== */
function flagsOf(m){
  var s={};
  m.ings.forEach(function(i){for(var x=0;x<i.f.length;x++)s[i.f[x]]=1;});
  return s;
}
function eligible(m,p,slot){
  var f=flagsOf(m);
  if(p==='a'){
    // sin legumbres, vísceras ni mariscos (ácido úrico); sin gluten/cereales salvo masa madre
    if(f.L||f.O||f.S)return false;
    for(var j=0;j<m.ings.length;j++){
      var g=m.ings[j].f;
      if((g.indexOf('G')>=0||g.indexOf('W')>=0)&&g.indexOf('Z')<0)return false;
    }
    // cenas: sin carne vacuna/cerdo ni almidones (papa, batata, mandioca, polenta)
    if(slot==='C'&&(f.R||f.P))return false;
    return true;
  }
  if(p==='b')return !f.M&&!f.G&&!f.O;   // vegetariana (huevo y lácteos sí), sin gluten
  if(p==='d')return m.k&&!f.S&&!f.O;    // solo platos simples y conocidos
  if(p==='i')return !f.O;               // sin pauta propia: todo menos vísceras
  return false;
}

function buildData(){
  var ING={};
  ING_RAW.trim().split('\n').forEach(function(l){
    var p=l.split('|');
    ING[p[0]]={u:p[1],c:p[2],f:p[3]||''};
  });
  var MEALS=[],seen={};
  MEAL_RAW.trim().split('\n').forEach(function(l){
    if(!l.trim())return;
    var p=l.split('|'),name=p[0];
    if(seen[name])throw new Error('Comida repetida: '+name);
    seen[name]=1;
    var ings=p[3].split(',').map(function(s){
      var q=s.lastIndexOf(':'),n=s.slice(0,q).trim();
      if(!ING[n])throw new Error('Ingrediente desconocido: '+n+' en '+name);
      return{n:n,q:parseFloat(s.slice(q+1)),u:ING[n].u,c:ING[n].c,f:ING[n].f};
    });
    var m={id:MEALS.length+1,name:name,type:p[1],k:p[2]==='k',ings:ings,tip:p[4]||'',ok:{}};
    ['A','C','M'].forEach(function(slot){
      if(m.type.indexOf(slot)<0)return;
      var s='';
      PROFILES.forEach(function(pr){if(eligible(m,pr.k,slot))s+=pr.k;});
      m.ok[slot]=s;
    });
    MEALS.push(m);
  });
  return{ING:ING,MEALS:MEALS};
}

if(typeof module!=='undefined')module.exports={PROFILES:PROFILES,buildData:buildData};
