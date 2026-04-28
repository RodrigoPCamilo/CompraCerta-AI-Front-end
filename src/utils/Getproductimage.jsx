// Biblioteca de imagens — Unsplash IDs verificados por categoria
// Anti-duplicata: hash determinístico pelo nome do produto

function hashNome(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return Math.abs(h >>> 0);
}
function norm(s) {
  return (s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

const POOLS = {
  fone:[
    "photo-1505740420928-5e560c06d30e","photo-1484704849700-f032a568e944",
    "photo-1583394838336-acd977736f90","photo-1545127398-14699f92334b",
    "photo-1572635196237-14b3f281503f","photo-1585386959984-a4155224a1ad",
    "photo-1590658268037-6bf12165a8df","photo-1613040809024-b4ef7ba99bc3",
    "photo-1631176093617-6f5dfbd2b23e","photo-1524678606370-a47ad25cb82a",
    "photo-1491927570842-0261e477d937","photo-1549421263-5ec394a5ad4c",
  ],
  smartphone:[
    "photo-1511707267537-b85faf00021e","photo-1510557880182-3d4d3cba35a5",
    "photo-1592750475338-74b7b21085ab","photo-1580910051074-3eb694886505",
    "photo-1601784551446-20c9e07cdbdb","photo-1610945415295-d9bbf067e59c",
    "photo-1585060544812-6b45742d762f","photo-1567784177951-6fa58317e16b",
    "photo-1616410011236-7a42121dd981","photo-1598327105854-c8674faddf79",
    "photo-1509390144018-eeeb8bc3cf14","photo-1551355738-1875b9b5e5c9",
  ],
  notebook:[
    "photo-1496181133206-80ce9b88a853","photo-1517336714731-489cc030c933",
    "photo-1603302576837-37561b2e2302","photo-1588702547919-26089e690ecc",
    "photo-1541807084-5c52b6b3adef","photo-1525547719571-a2d4ac8945e2",
    "photo-1484788984921-03950022c9ef","photo-1531297484001-80022131f5a1",
    "photo-1542393545-10f5cde2c810","photo-1614632537197-38a17061c2bd",
    "photo-1611078489935-0cb964de46d6","photo-1468495244123-6c6c332eeece",
  ],
  tablet:[
    "photo-1544244015-0df4b3ffc6b0","photo-1561154464-82e9adf32764",
    "photo-1589739900243-4b52cd9b104e","photo-1542751110-97427bbecf20",
    "photo-1580407196238-dac33f57c410","photo-1585792180666-f7347c490ee2",
    "photo-1540829917886-91ab031b1764","photo-1455390582262-044cdead277a",
    "photo-1519389950473-47ba0277781c","photo-1630825549815-e9ae46e6a0f1",
    "photo-1544244015-0df4b3ffc6b0","photo-1561154464-82e9adf32764",
  ],
  tv:[
    "photo-1593784991095-a205069470b6","photo-1461151304267-38535e780c79",
    "photo-1546054454-aa26e2b734c7","photo-1567690187548-f07b1d7bf754",
    "photo-1509281373149-e957c6296406","photo-1574375927938-d5a98e8ffe85",
    "photo-1558888401-3cc1de77652d","photo-1600121848594-d8644e57abab",
    "photo-1619462729009-71bfe9d8cf24","photo-1585298723682-7115561c51b7",
    "photo-1552975084-6e027cd345c2","photo-1513694203232-719a280e022f",
  ],
  games:[
    "photo-1606144042614-b2417e99c4e3","photo-1493711662062-fa541aff3d6b",
    "photo-1538481199705-c710c4e965fc","photo-1550745165-9bc0b252726f",
    "photo-1586182987320-4f376d39d787","photo-1535016120720-40c646be5580",
    "photo-1612287230202-1ff1d85d1bdf","photo-1509198397868-475647b2a1e5",
    "photo-1556438064-2d7646166914","photo-1592155931584-901ac15763e3",
    "photo-1627163439134-7a8c47e08208","photo-1616588589676-62b3bd4ff6d2",
  ],
  camera:[
    "photo-1516035069371-29a1b244cc32","photo-1502920917128-1aa500764cbd",
    "photo-1471479917193-f00955256257","photo-1452780212441-e4a548f87a59",
    "photo-1510127034890-ba27508e9f1c","photo-1495707902641-75cac588d2e9",
    "photo-1609372332255-611485350f25","photo-1607462109225-6b64ae2dd3cb",
    "photo-1531591483764-b75f54d37dff","photo-1617005082133-548c4dd27f35",
    "photo-1581591524425-c7e0978865fc","photo-1516035069371-29a1b244cc32",
  ],
  relogio:[
    "photo-1523275335684-37898b6baf30","photo-1579586337278-3befd40fd17a",
    "photo-1508685096489-7aacd43bd3b1","photo-1617043786394-f977fa12eddf",
    "photo-1434056886845-dac89ffe9b56","photo-1542496658-e33a6d0d50f6",
    "photo-1629429408209-1f912961dbd8","photo-1575311373937-040b8e1fd5b6",
    "photo-1611085583191-a3b181a88401","photo-1546868871-7041f2a55e12",
    "photo-1523275335684-37898b6baf30","photo-1508685096489-7aacd43bd3b1",
  ],
  tenis:[
    "photo-1542291026-7eec264c27ff","photo-1606107557195-0e29a4b5b4aa",
    "photo-1491553895911-0055eca6402d","photo-1560769629-975ec94e6a86",
    "photo-1575537302964-96cd47c06b1b","photo-1518894781321-630e638d0742",
    "photo-1525966222134-fcfa99b8ae77","photo-1595950653106-6c9ebd614d3a",
    "photo-1600269452121-4f2416e55c28","photo-1556906781-9a412961a28c",
    "photo-1542291026-7eec264c27ff","photo-1606107557195-0e29a4b5b4aa",
  ],
  roupa:[
    "photo-1521572163474-6864f9cf17ab","photo-1503341504253-dff4815485f1",
    "photo-1583743814966-8936f5b7be1a","photo-1576566588028-4147f3842f27",
    "photo-1562157873-818bc0726f68","photo-1434389677669-e08b4cac3105",
    "photo-1596755389378-c31d21fd1273","photo-1542272604-787c3835535d",
    "photo-1489987707025-afc232f7ea0f","photo-1620799140188-3b2a02fd97f4",
    "photo-1564584217132-2271feaeb3c5","photo-1591047139829-d91aecb6caea",
  ],
  eletrodomestico:[
    "photo-1574269909862-7e1d70bb8078","photo-1556909114-f6e7ad7d3136",
    "photo-1626200419199-391ae4be7a41","photo-1570222094114-d054a817e56b",
    "photo-1584568694244-14fbdf83bd30","photo-1556909172-54557c7e4fb7",
    "photo-1556911220-e15b29be8c8f","photo-1507914372368-b2b085b925a1",
    "photo-1615485290382-441e4d049cb5","photo-1574269909862-7e1d70bb8078",
    "photo-1556909114-f6e7ad7d3136","photo-1626200419199-391ae4be7a41",
  ],
  perfume:[
    "photo-1592945403244-b3fbafd7f539","photo-1541643600914-78b084683702",
    "photo-1594897030264-ab7d87efc473","photo-1615397587950-3cbb55f95b39",
    "photo-1619451683067-8bf7ab5e8eb7","photo-1592945403244-b3fbafd7f539",
    "photo-1541643600914-78b084683702","photo-1594897030264-ab7d87efc473",
    "photo-1615397587950-3cbb55f95b39","photo-1619451683067-8bf7ab5e8eb7",
    "photo-1592945403244-b3fbafd7f539","photo-1541643600914-78b084683702",
  ],
  fitness:[
    "photo-1534438327276-14e5300c3a48", // academia halteres
    "photo-1517836357463-d25dfeac3438", // treino academia
    "photo-1571019613454-1cb2f99b2d8b", // equipamento fitness
    "photo-1583454110551-21f2fa2afe61", // yoga mat
    "photo-1574680096145-d05b474e2155", // fitness product
    "photo-1490645935967-10de6ba17061", // suplemento
    "photo-1549060279-7e168fcee0c2", // whey protein
    "photo-1558618666-fcd25c85cd64", // academia equipment
    "photo-1544367567-0f2fcb009e0b", // yoga treino
    "photo-1476480862126-209bfaa8edc8", // corrida tenis
    "photo-1521804906057-1df8fdb718b7", // fitness gear
    "photo-1517438984742-1262db08379e", // dumbbells
  ],
    casa:[
    "photo-1555041469-a586c61ea9bc", // sofa sala
    "photo-1556909114-f6e7ad7d3136", // cozinha utensilio
    "photo-1484154218962-a197022b5858", // cozinha moderna
    "photo-1493663284031-b7e3aefcae8e", // decoração sala
    "photo-1567016432779-094069958ea5", // quarto decoração
    "photo-1616486338812-3dadae4b4ace", // decoração casa
    "photo-1583847268964-b28dc8f51f92", // sala de estar
    "photo-1586023492125-27b2c045efd7", // decoração moderna
    "photo-1558618666-fcd25c85cd64", // utensilio cozinha
    "photo-1507003211169-0a1dd7228f2d", // mesa jantar
    "photo-1555041469-a586c61ea9bc", // sofa
    "photo-1484154218962-a197022b5858", // cozinha
  ],
    livros:[
    "photo-1512820790803-83ca734da794", // livros pilha
    "photo-1481627834876-b7833e8f5570", // biblioteca livros
    "photo-1495446815901-a7297e633e8d", // livro aberto
    "photo-1507842217343-583bb7270b66", // estante livros
    "photo-1519682577862-22b62b24e493", // livro produto
    "photo-1524995997946-a1c2e315a42f", // leitura livros
    "photo-1543002588-bfa74002ed7e", // livros coloridos
    "photo-1456513080510-7bf3a84b82f8", // estudar livro
    "photo-1497633762265-9d179a990aa6", // livros mesa
    "photo-1512820790803-83ca734da794", // repeat
    "photo-1481627834876-b7833e8f5570", // repeat
    "photo-1495446815901-a7297e633e8d", // repeat
  ],
  geral:[
    "photo-1607082348824-0a96f2a4b9da","photo-1560393464-5c69a73c5770",
    "photo-1441986300917-64674bd600d8","photo-1556742049-0cfed4f6a45d",
    "photo-1472851294608-062f824d29cc","photo-1483985988355-763728e1935b",
    "photo-1542838132-92c53300491e","photo-1619654360007-34588e9e4d25",
    "photo-1526170375885-4d8ecf77b99f","photo-1607082348824-0a96f2a4b9da",
    "photo-1560393464-5c69a73c5770","photo-1441986300917-64674bd600d8",
  ],
};

const KEYWORDS = [
  // Fones — mais específico primeiro
  {cat:'fone', words:[
    'apple airpods','airpods pro','airpods','airpod','jbl tune','jbl free','jbl live',
    'jbl charge','jbl flip','jbl go','jbl clip','jbl bar','sony wh','sony wf','beats',
    'sennheiser','bose','galaxy buds','fone de ouvido','headphone','headset','earphone',
    'earbuds','tws','razer kraken','hyperx cloud','steelseries arctis','logitech g pro',
    'turtle beach','jabra','anker soundcore','edifier','plantronics','skullcandy',
  ]},
  // Smartwatch
  {cat:'relogio', words:[
    'apple watch','galaxy watch','amazfit','garmin','fitbit','huawei watch','fossil',
    'smartwatch','mi band','pulseira fitness','relógio inteligente','samsung watch',
  ]},
  // TV
  {cat:'tv', words:[
    'smart tv','lg oled','lg qned','samsung qled','samsung neo','oled tv','qled',
    'televisão','tcl tv','philips tv','aoc tv','tv 4k','tv 8k',
  ]},
  // Games
  {cat:'games', words:[
    'playstation 5','playstation 4','ps5','ps4','xbox series','xbox one',
    'nintendo switch','controle gamer','asus rog','msi gaming','razer blade',
    'rtx 4090','rtx 4080','rtx 3080','rtx 3070','rtx 3060','gtx 1660',
  ]},
  // Tablet
  {cat:'tablet', words:[
    'ipad pro','ipad air','ipad mini','ipad','galaxy tab','tablet','xiaomi pad',
  ]},
  // Câmera
  {cat:'camera', words:[
    'câmera','canon eos','nikon','sony alpha','fujifilm','mirrorless','dslr',
    'gopro','webcam','action cam','instax',
  ]},
  // Notebook — antes de tênis para evitar "acer swift" bater em swift
  {cat:'notebook', words:[
    'macbook pro','macbook air','macbook','dell xps','dell inspiron','dell g15',
    'hp pavilion','hp envy','hp omen','lenovo thinkpad','lenovo ideapad','lenovo legion',
    'asus vivobook','asus zenbook','asus tuf gaming','asus rog zephyrus',
    'acer aspire','acer nitro','acer predator','msi laptop','samsung galaxy book',
    'notebook gamer','notebook','laptop','chromebook',
  ]},
  // Tênis — inclui modelos sem marca (como a IA retorna)
  {cat:'fitness', words:[
    'halter','kettlebell','esteira','bicicleta ergométrica','bicicleta spinning',
    'whey protein','creatina','bcaa','suplemento','proteína','colágeno',
    'tapete yoga','yoga mat','elástico exercício','corda pular','pull up',
    'luva academia','cinto musculação','joelheira','caneleira','mochila esporte',
    'fitness','academia','musculação','treino','esportivo',
  ]},
    {cat:'casa', words:[
    'sofá','sofa','poltrona','mesa de jantar','cadeira','cama','colchão',
    'travesseiro','edredom','toalha','panela','frigideira','liquidificador',
    'decoração','vaso','quadro','tapete','cortina','prateleira','organizador',
    'cozinha','sala de estar','quarto','banheiro','luminária','abajur',
  ]},
    {cat:'livros', words:[
    // Detecção por gênero e tipo
    'livro','romance','ficção','fantasia','autoajuda','biografia','autobiografia',
    'mangá','manga','hq','quadrinhos','thriller','policial','história','filosofia',
    'literatura','poesia','conto','ensaio','técnico','educação','guia','manual',
    'coleção','volume','vol.','ed.','edição',
    // Autores brasileiros e internacionais famosos
    'paulo coelho','machado de assis','clarice lispector','monteiro lobato',
    'j.k. rowling','harry potter','tolkien','george r.r. martin',
    'yuval noah harari','sapiens','robert c. martin','clean code',
    'stephen king','agatha christie','dan brown','george orwell',
    // Séries e títulos populares
    'harry potter','senhor dos anéis','game of thrones','percy jackson',
    'hunger games','divergente','hobbit','narnia','duna','fundação',
    'crônicas de gelo','o alquimista','a culpa é das estrelas',
    'casa de papel','breaking bad',
    // Livros técnicos e educação
    'clean code','código limpo','design patterns','estrutura de dados',
    'algoritmos','machine learning','inteligência artificial',
    'enem','vestibular','concurso','guia de estudo',
    // Detectar pelo padrão "Nome – Autor" comum em livros
    'fullmetal alchemist','bleach','naruto','one piece','dragon ball',
    'attack on titan','demon slayer','jujutsu','death note',
    // Títulos populares sem palavras-chave óbvias
    'sutil arte','sapiens','outliers','hábitos atômicos','poder do hábito',
    'pai rico','pense e enriqueça','a menina que roubava livros',
    'diário de um banana','percy jackson','divergente','jogos vorazes',
    'crepúsculo','cinquenta tons','o hobbit','duna',
    // Padrões de títulos de livros: "Nome – Autor" ou "Título: Subtítulo"
  ]},
  {cat:'tenis', words:[
    // Com marca
    'adidas ultraboost','adidas superstar','adidas stan smith','adidas yung',
    'adidas adizero','adidas campus','adidas gazelle','adidas samba','adidas nmd',
    'nike air max','nike air force','nike react','nike free','nike dunk',
    'vans old skool','vans sk8','converse all star','puma','reebok classic',
    'new balance','asics gel','mizuno wave','fila','skechers','under armour',
    // Sem marca (como a IA retorna)
    'ultraboost','superstar','stan smith','adizero','campus','gazelle','samba','yung','forum','rivalry','handball',
    'air max','air force 1','dunk low','dunk high','chuck taylor',
    // Genérico
    'tênis','tenis','sneaker','calçado esportivo','running shoe',
  ]},
  // Smartphone
  {cat:'smartphone', words:[
    'iphone 15','iphone 14','iphone 13','iphone 12','iphone 11','iphone se','iphone',
    'galaxy s24','galaxy s23','galaxy s22','galaxy s21','galaxy a','galaxy m','galaxy z',
    'redmi note','redmi','xiaomi','poco','moto g','moto e','motorola edge','motorola',
    'realme','oneplus','google pixel','zenfone','smartphone','celular',
  ]},
  // Roupa
  {cat:'roupa', words:[
    'camiseta','camisa polo','camisa social','vestido','calça jeans','jaqueta',
    'moletom','casaco','bermuda','shorts','blusa','regata',
  ]},
  // Eletrodoméstico
  {cat:'eletrodomestico', words:[
    'geladeira','fogão','microondas','lavadora','ar condicionado','airfryer',
    'panela','cafeteira','aspirador','ferro de passar',
  ]},
  // Perfume
  {cat:'perfume', words:[
    'perfume','colônia','cologne','eau de parfum','eau de toilette','body splash',
  ]},
];

function detectCategoria(nome) {
  if (!nome) return 'geral';
  const n = norm(nome);
  for (const {cat, words} of KEYWORDS) {
    if (words.some(w => {
      const nw = norm(w);
      // Usar word boundary para evitar falsos positivos
      // Ex: "sofa" não deve bater em "filosofal"
      const escaped = nw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp('(^|\\s|[^a-z])' + escaped + '($|\\s|[^a-z])').test(n) || 
             (nw.length > 6 && n.includes(nw)); // palavras longas (>6 chars) são seguras como substring
    })) return cat;
  }
  return 'geral';
}

export function getProductImage(nomeProduto) {
  const cat = detectCategoria(nomeProduto);
  const ids = POOLS[cat] || POOLS.geral;
  const idx = hashNome(nomeProduto || 'produto') % ids.length;
  return `https://images.unsplash.com/${ids[idx]}?w=600&q=80&fit=crop&auto=format`;
}