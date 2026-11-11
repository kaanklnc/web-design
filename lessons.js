// Dr. Mesut ÜNLÜ Web Programming Slaytlarına Göre Adım Adım Lab Müfredatı
// Tüm kontroller gerçek DOMParser ve CSS normalizasyonu ile çalışır.

function normalizeCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function hasCssRule(css, selectorSnippet, propSnippet) {
  const clean = normalizeCss(css);
  const escSel = selectorSnippet
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s*,\s*/g, "\\s*,\\s*");
  const blockRegex = new RegExp(escSel + "\\s*\\{([^}]*)\\}");
  const match = clean.match(blockRegex);
  if (!match) return false;
  if (!propSnippet) return match[1].trim().length > 0;
  if (propSnippet instanceof RegExp) return propSnippet.test(match[1]);
  const escProp = propSnippet.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(escProp).test(match[1]);
}

window.LAB_LESSONS = [
  // ===================== MODÜL 1: HTML TEMELLERİ =====================
  {
    id: 1,
    module: "Modül 1: HTML Temelleri",
    examTag: "",
    title: "Adım 1: İlk HTML5 Sayfa İskeleti",
    slideRef: "Week 2-1 • HTML Basics (Slayt 2-4)",
    meaning: `
      <strong>HTML</strong> (HyperText Markup Language), bir web sayfasının iskeletidir — tıpkı bir binanın kolon ve duvarları gibi.<br>
      Her HTML sayfası şu mantıkla çalışır: Tarayıcıya önce "Bu bir <strong>HTML5</strong> belgesidir" (<code>&lt;!DOCTYPE html&gt;</code>) dersin. Ardından her şeyi saran kök etiket <code>&lt;html&gt;</code> açılır. İçinde iki ana oda vardır:
      <br>• <code>&lt;head&gt;</code>: Sayfanın <strong>beyni / ayarları</strong> (tarayıcı sekmesindeki başlık gibi). Ekranda gövde olarak görünmez.
      <br>• <code>&lt;body&gt;</code>: Sayfanın <strong>görünen sahnesi</strong> (başlıklar, paragraflar, formlar, resimler hep buraya yazılır).
    `,
    tokens: [
      { code: "<!DOCTYPE html>", desc: "Tarayıcıya 'Bu belge modern HTML5 standardında yazıldı' bildirimini verir. Sayfanın en ilk satırıdır." },
      { code: "<html>...</html>", desc: "Tüm HTML kodlarını saran kök (ana) elemandır. Başlangıç etiketi <etiket>, bitiş etiketi </etiket> şeklinde yazılır." },
      { code: "<head>...</head>", desc: "Sayfa hakkında bilgi (meta veri, sekme başlığı, CSS bağlantısı) içerir; sayfa içine doğrudan çizilmez." },
      { code: "<title>...</title>", desc: "Tarayıcı sekmesinin (tab) üstünde görünen sayfa adını belirler." },
      { code: "<body>...</body>", desc: "Kullanıcının ekranda gördüğü tüm içerikleri (h1, p, img, form, table...) tutan gövde kapsayıcısıdır." },
      { code: "<h1>...</h1>", desc: "En büyük ve en önemli ana başlık etiketidir." },
      { code: "<p>...</p>", desc: "Paragraf (metin bloğu) oluşturur." }
    ],
    hint: "Başlangıç kodunda <body> içine bir <h1>Web Programming</h1> ve altına <p>Benim ilk web sayfam.</p> satırlarını ekle. Etiketi açtığın gibi mutlaka </etiket> ile kapatmayı unutma!",
    starterHtml: `<!DOCTYPE html>
<html>
<head>
  <title>DBMS Course</title>
</head>
<body>
  <!-- GÖREV 1: Buraya <h1> ile bir ana başlık yaz -->
  
  <!-- GÖREV 2: Altına <p> ile bir paragraf yaz -->
  
</body>
</html>`,
    starterCss: `/* Bu adımda sadece HTML iskeleti yazıyoruz. CSS'e Modül 3'te geçeceğiz! */`,
    solutionHtml: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Web Programming</h1>
  <p>Bu benim ilk HTML5 sayfam.</p>
</body>
</html>`,
    solutionCss: `/* Bu adımda sadece HTML iskeleti yazıyoruz. */`,
    tasks: [
      {
        label: "Sayfanın en başında <code>&lt;!DOCTYPE html&gt;</code> bildirimi bulunsun.",
        check: (_doc, html) => /<!doctype\s+html>/i.test(html)
      },
      {
        label: "<code>&lt;head&gt;</code> içinde boş olmayan bir <code>&lt;title&gt;</code> etiketi olsun.",
        check: (doc) => {
          const t = doc.querySelector("head title");
          return !!(t && t.textContent.trim().length > 0);
        }
      },
      {
        label: "<code>&lt;body&gt;</code> içine bir <code>&lt;h1&gt;</code> ana başlığı yaz.",
        check: (doc) => {
          const h1 = doc.querySelector("body h1");
          return !!(h1 && h1.textContent.trim().length > 0);
        }
      },
      {
        label: "<code>&lt;body&gt;</code> içine bir <code>&lt;p&gt;</code> paragrafı ekle.",
        check: (doc) => {
          const p = doc.querySelector("body p");
          return !!(p && p.textContent.trim().length > 0);
        }
      }
    ]
  },

  {
    id: 2,
    module: "Modül 1: HTML Temelleri",
    examTag: "",
    title: "Adım 2: Başlıklar, Metin Biçimlendirme & Boş Etiketler",
    slideRef: "Week 2-1 (Slayt 8-16, 22) • Week 2-2 (Slayt 2)",
    meaning: `
      HTML'de başlıklar önem sırasına göre <code>&lt;h1&gt;</code> (en büyük) ile <code>&lt;h6&gt;</code> (en küçük) arasındadır.<br>
      Kimi etiketlerin kapanış etiketi yoktur; bunlara <strong>Empty HTML Element</strong> (Boş Eleman) denir: <code>&lt;br&gt;</code> alt satıra geçirir, <code>&lt;hr&gt;</code> yatay ayırıcı çizgi çizer.<br>
      Metni vurgulamak için <code>&lt;strong&gt;</code> (önemli kalın), <code>&lt;em&gt;</code> (vurgulu italik) ve <code>&lt;mark&gt;</code> (fosforlu işaretleme) kullanılır.
    `,
    tokens: [
      { code: "<h1>..<h6>", desc: "Başlık seviyeleri: h1 en önemli/büyük başlık, h6 en küçük başlıktır." },
      { code: "<strong>", desc: "Anlamsal olarak 'güçlü önem' taşır ve ekranda kalın (bold) görünür." },
      { code: "<em>", desc: "Vurgulanan metin (emphasized); ekranda eğik (italic) görünür." },
      { code: "<mark>", desc: "Metni sarı fosforlu kalemle çizilmiş gibi vurgular." },
      { code: "<br>", desc: "Line break: kapanış etiketi olmayan boş elemandır, tek satır aşağı indirir." },
      { code: "<hr>", desc: "Thematic break: içerikler arasına yatay çizgi çizer. Kapanış etiketi yoktur." },
      { code: "<!-- ... -->", desc: "HTML yorum satırıdır; sadece kodu okuyan geliştirici görür, tarayıcı ekrana basmaz." }
    ],
    hint: "<h2>Alt Başlık</h2> ekle, paragraf içinde önemli bir kelimeyi <strong>...</strong> içine al, <mark>...</mark> ile bir kelimeyi vurgula ve altına <hr> ekle.",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h1>HTML Metin Laboratuvarı</h1>
  <!-- Alt başlık (h2) ekle -->

  <p>
    Web dersinde <!-- <strong> ile önemli kelime ekle --> öğreniyoruz.<br>
    Sınavda <!-- <mark> ile vurgulu kelime ekle --> konusu çok çıkacak!
  </p>

  <!-- Araya <hr> yatay çizgisi koy -->

</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h1>HTML Metin Laboratuvarı</h1>
  <h2>Vize Hazırlık Notları</h2>

  <p>
    Web dersinde <strong>HTML5 etiketlerini</strong> öğreniyoruz.<br>
    Sınavda <mark>Form ve Seçiciler</mark> konusu çok çıkacak!
  </p>

  <hr>
  <p><em>Başarılar dileriz.</em></p>
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "Sayfada en az bir adet <code>&lt;h2&gt;</code> alt başlığı olsun.",
        check: (doc) => {
          const el = doc.querySelector("h2");
          return !!(el && el.textContent.trim().length > 0);
        }
      },
      {
        label: "Önemli bir kelimeyi <code>&lt;strong&gt;...&lt;/strong&gt;</code> içine yaz.",
        check: (doc) => {
          const el = doc.querySelector("strong");
          return !!(el && el.textContent.trim().length > 0);
        }
      },
      {
        label: "Fosforlu vurgulama için <code>&lt;mark&gt;...&lt;/mark&gt;</code> kullan.",
        check: (doc) => {
          const el = doc.querySelector("mark");
          return !!(el && el.textContent.trim().length > 0);
        }
      },
      {
        label: "Bölüm ayırıcı yatay çizgi olarak <code>&lt;hr&gt;</code> ekle.",
        check: (doc) => !!doc.querySelector("hr")
      }
    ]
  },

  {
    id: 3,
    module: "Modül 1: HTML Temelleri",
    examTag: "",
    title: "Adım 3: Bağlantılar (&lt;a&gt;) ve Görseller (&lt;img&gt;)",
    slideRef: "Week 2-1 • HTML Basics (Slayt 17-32)",
    meaning: `
      Etiketlerin içine yazdığımız ek bilgilere <strong>Attribute (Nitelik)</strong> denir ve hep <code>isim="değer"</code> formatında açılış etiketine yazılır.<br>
      • <code>&lt;a href="adres"&gt;Metin&lt;/a&gt;</code> tıklanabilir link yapar. <code>target="_blank"</code> eklersen link <strong>yeni sekmede</strong> açılır. <code>mailto:</code> e-posta açar.<br>
      • <code>&lt;img src="resim.png" alt="Açıklama"&gt;</code> kapanış etiketi olmayan boş bir etikettir; <code>src</code> resim yolunu, <code>alt</code> resim yüklenemezse gösterilecek yazıyı belirler.
    `,
    tokens: [
      { code: '<a href="...">', desc: "Hyperlink etiketi. Gidilecek adresi 'href' niteliği belirler." },
      { code: 'target="_blank"', desc: "Linkin veya form sonucunun yeni tarayıcı sekmesinde (_blank) açılmasını sağlar." },
      { code: 'title="..."', desc: "Fare ile üzerine gelindiğinde küçük ipucu balonu (tooltip) gösterir." },
      { code: 'href="mailto:..."', desc: "Tıklandığında kullanıcının varsayılan e-posta programını açar." },
      { code: "<img src alt>", desc: "Görsel ekler. Kapanış etiketi yoktur! src (kaynak yol) ve alt (alternatif metin) zorunlu iki niteliktir." }
    ],
    hint: '<a href="https://www.ostimteknik.edu.tr" target="_blank" title="Üniversite Sitesi">OSTİM Web</a> yaz ve altına bir <img> (hem src hem alt niteliği dolu) ekle.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h2>Faydalı Bağlantılar</h2>
  <!-- 1) target="_blank" ve title içeren bir <a> linki ekle -->
  <p>Üniversite sitesi: </p>

  <!-- 2) mailto: ile başlayan bir e-posta linki ekle -->
  <p>İletişim: </p>

  <!-- 3) src ve alt niteliğine sahip bir <img> görseli ekle -->
  <!-- İpucu: src olarak https://via.placeholder.com/160x60 kullanabilirsin -->
  
</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h2>Faydalı Bağlantılar</h2>
  <p>Üniversite sitesi: 
    <a href="https://www.ostimteknik.edu.tr" target="_blank" title="OSTİM Teknik Üniversitesi">OSTİM Web</a>
  </p>

  <p>İletişim: 
    <a href="mailto:student@ostimteknik.edu.tr">E-posta Gönder</a>
  </p>

  <img src="https://via.placeholder.com/180x60?text=HTML5+Lab" alt="HTML5 Lab Örnek Görseli" width="180" height="60">
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "<code>href</code> ve <code>target=\"_blank\"</code> özellikli bir <code>&lt;a&gt;</code> linki ekle.",
        check: (doc) => !!doc.querySelector('a[href][target="_blank"]')
      },
      {
        label: "<code>href</code> değeri <code>mailto:</code> ile başlayan bir e-posta linki ekle.",
        check: (doc) => !!doc.querySelector('a[href^="mailto:"]')
      },
      {
        label: "Hem <code>src</code> hem de boş olmayan <code>alt</code> niteliğine sahip bir <code>&lt;img&gt;</code> etiketi ekle.",
        check: (doc) => {
          const img = doc.querySelector("img[src][alt]");
          return !!(img && img.getAttribute("src").trim() && img.getAttribute("alt").trim());
        }
      }
    ]
  },

  {
    id: 4,
    module: "Modül 1: HTML Temelleri",
    examTag: "",
    title: "Adım 4: Listeler (&lt;ul&gt;, &lt;ol&gt;) ve Tablolar (&lt;table&gt;)",
    slideRef: "Week 2-2 • HTML Basics (Slayt 7-17)",
    meaning: `
      <strong>Listeler:</strong><br>
      • <code>&lt;ul&gt;</code> (Unordered List): Madde işaretli (noktalı) liste.<br>
      • <code>&lt;ol&gt;</code> (Ordered List): Numaralı (1, 2, 3...) sıralı liste. Her ikisinin içindeki maddeler <code>&lt;li&gt;</code> ile yazılır.<br>
      <strong>Tablolar:</strong> <code>&lt;table&gt;</code> tablo başlatır. İçinde satır açmak için <code>&lt;tr&gt;</code>, kalın başlık hücresi için <code>&lt;th&gt;</code>, normal veri hücresi için <code>&lt;td&gt;</code> kullanılır. Sütun birleştirme <code>colspan</code>, satır birleştirme <code>rowspan</code> ile yapılır!
    `,
    tokens: [
      { code: "<ul> / <ol>", desc: "ul = sırasız (noktalı) liste, ol = sıralı (1,2,3) liste." },
      { code: "<li>", desc: "List Item: ul veya ol içindeki her bir satır maddesi." },
      { code: "<dl><dt><dd>", desc: "Description List: Terim (<dt>) ve o terimin açıklamasını (<dd>) listeler." },
      { code: "<table> / <tr>", desc: "table tabloyu, tr (table row) her bir yatay satırı oluşturur." },
      { code: "<th> / <td>", desc: "th = tablo başlık hücresi (kalın/ortalı), td = normal veri hücresi." },
      { code: 'colspan="2"', desc: "Bir hücreyi yatayda 2 sütun genişliğinde birleştirir (rowspan ise dikeyde satır birleştirir)." }
    ],
    hint: "Bir <ul> listesine en az 2 <li> ekle. Ardından <table border=\"1\"> açıp ilk satıra <th> Ders </th><th> Puan </th>, diğer satırlara <td> verileri yaz. Son satırda <td colspan=\"2\"> kullanarak birleştirme yap!",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h3>Vize Konuları</h3>
  <!-- Sırasız liste (ul) ve içine 2 tane li ekle -->
  <ul>
    <li>HTML Forms</li>
  </ul>

  <h3>Not Dağılımı Tablosu</h3>
  <table border="1">
    <tr>
      <th>Bölüm</th>
      <th>Puan</th>
    </tr>
    <tr>
      <td>Multiple-Choice</td>
      <td>60</td>
    </tr>
    <!-- Aşağıdaki satırı Fill-in-the-Blank için tamamla ve altına colspan="2" olan bir Toplam satırı ekle -->
  </table>
</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h3>Vize Konuları</h3>
  <ul>
    <li>HTML5 Form Structures</li>
    <li>CSS Selectors</li>
    <li>CSS Box Model &amp; Layout</li>
  </ul>

  <h3>Not Dağılımı Tablosu</h3>
  <table border="1">
    <tr>
      <th>Bölüm</th>
      <th>Puan</th>
    </tr>
    <tr>
      <td>Multiple-Choice (40 Soru)</td>
      <td>60</td>
    </tr>
    <tr>
      <td>Fill-in-the-Blank (10 Soru)</td>
      <td>20</td>
    </tr>
    <tr>
      <td colspan="2"><strong>Toplam (Kodlama Dahil): 100 Puan</strong></td>
    </tr>
  </table>
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "<code>&lt;ul&gt;</code> içinde en az 2 adet <code>&lt;li&gt;</code> maddesi bulunsun.",
        check: (doc) => doc.querySelectorAll("ul li").length >= 2
      },
      {
        label: "<code>&lt;table&gt;</code> içinde başlık hücreleri (<code>&lt;th&gt;</code>) ve en az 3 satır (<code>&lt;tr&gt;</code>) olsun.",
        check: (doc) => doc.querySelectorAll("table th").length >= 2 && doc.querySelectorAll("table tr").length >= 3
      },
      {
        label: "Tabloda hücre birleştirmek için <code>colspan</code> niteliğini kullan.",
        check: (doc) => !!doc.querySelector("table [colspan]")
      }
    ]
  },

  // ===================== MODÜL 2: HTML5 FORMLARI =====================
  {
    id: 5,
    module: "Modül 2: HTML5 Formları",
    examTag: "Vize Odağı",
    title: "Adım 5: Form İskeleti (action, method, target, fieldset)",
    slideRef: "Week 2-1 • HTML Basics (Slayt 38-44, 54)",
    meaning: `
      <strong>VİZE UYARISI:</strong> Hoca kodlama sorusunda HTML form yapılarını mutlaka soracak!<br>
      Bir form, kullanıcıdan veri toplayıp sunucuya gönderen kutudur:
      <br>• <code>action="/register.php"</code> → Form gönderilince verinin gideceği <strong>hedef sayfa/adres</strong>.
      <br>• <code>method="post"</code> vs <code>"get"</code> → <code>get</code> veriyi adres çubuğuna açık ekler (şifre için ASLA kullanılmaz, max 2048 karakter); <code>post</code> veriyi HTTP isteğinin gövdesine (body) gizleyerek gönderir!
      <br>• <code>target="_blank"</code> → Yanıtı yeni sekmede açar.
      <br>• <code>&lt;fieldset&gt;</code> formu gruplayan çerçevedir; <code>&lt;legend&gt;</code> o çerçevenin başlığıdır.
    `,
    tokens: [
      { code: "<form>", desc: "Kullanıcı girdilerini toplayan ana kapsayıcı etikettir." },
      { code: 'action="..."', desc: "Form verilerinin işlenmek üzere gönderileceği sunucu dosyası veya URL." },
      { code: 'method="post"', desc: "Verileri URL'de göstermeden HTTP isteği gövdesinde (güvenli) gönderir." },
      { code: 'method="get"', desc: "Verileri URL sonuna (?isim=deger) ekler. Yer imi (bookmark) eklenebilir ama hassas veri için yasaktır!" },
      { code: "<fieldset>", desc: "İlgili form alanlarını kutu/çerçeve içine alarak gruplar." },
      { code: "<legend>", desc: "<fieldset> çerçevesinin sol üstüne yazılan başlık etiketidir." }
    ],
    hint: '<form action="/register.php" method="post" target="_blank"> yaz, içine <fieldset> ve ilk satırına <legend>Öğrenci Kayıt</legend> ekle.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h2>Kurs Kayıt Formu</h2>
  <!-- GÖREV: <form> etiketine action, method="post" ve target="_blank" ekle -->
  <form>
    <!-- GÖREV: Buraya <fieldset> ve içine <legend> ekle -->
    
  </form>
</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h2>Kurs Kayıt Formu</h2>
  <form action="/register.php" method="post" target="_blank">
    <fieldset>
      <legend>Student Registration</legend>
      <p>Form alanları bir sonraki adımda bu kutunun içine gelecek.</p>
    </fieldset>
  </form>
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "<code>&lt;form&gt;</code> etiketine boş olmayan bir <code>action</code> niteliği yaz.",
        check: (doc) => {
          const f = doc.querySelector("form[action]");
          return !!(f && f.getAttribute("action").trim().length > 0);
        }
      },
      {
        label: "Güvenli veri gönderimi için <code>method=\"post\"</code> tanımla.",
        check: (doc) => {
          const f = doc.querySelector("form[method]");
          return !!(f && f.getAttribute("method").toLowerCase() === "post");
        }
      },
      {
        label: "Yanıtın yeni sekmede açılması için <code>target=\"_blank\"</code> ekle.",
        check: (doc) => {
          const f = doc.querySelector('form[target="_blank"]');
          return !!f;
        }
      },
      {
        label: "Form içinde <code>&lt;fieldset&gt;</code> ve bunun içinde <code>&lt;legend&gt;</code> başlığı oluştur.",
        check: (doc) => {
          const leg = doc.querySelector("form fieldset legend");
          return !!(leg && leg.textContent.trim().length > 0);
        }
      }
    ]
  },

  {
    id: 6,
    module: "Modül 2: HTML5 Formları",
    examTag: "Vize Odağı",
    title: "Adım 6: Label Bağlantısı, Text ve Password Kutuları",
    slideRef: "Week 2-1 • HTML Basics (Slayt 39, 47, 58-59)",
    meaning: `
      Formda bir metin kutusu yaptığında yanına kullanıcı ne yazacağını bilsin diye <code>&lt;label&gt;</code> koyarız.<br>
      <strong>Altın Kural:</strong> <code>&lt;label for="kutuid"&gt;</code> içindeki <strong><code>for</code></strong> değeri ile <code>&lt;input id="kutuid"&gt;</code> içindeki <strong><code>id</code></strong> değeri <strong>BİREBİR AYNI</strong> olmalıdır! Böylece kullanıcı yazıya tıkladığında bile imleç doğrudan kutunun içine girer.<br>
      Sunucu veriyi tanıyabilsin diye <code>name="..."</code> niteliği de şarttır (<code>name</code> olmazsa veri gönderilmez!).
    `,
    tokens: [
      { code: '<label for="x">', desc: "Kutunun açıklamasıdır. 'for' değeri, hedef input'un 'id' değeriyle aynı olmalıdır." },
      { code: 'id="..."', desc: "Sayfadaki tekil kimlik. label'ın 'for' özelliği ve CSS #id seçicisi buraya bağlanır." },
      { code: 'name="..."', desc: "Form gönderildiğinde sunucuya gidecek anahtar adıdır (ör. sname=Ali)." },
      { code: 'type="text"', desc: "Tek satırlık normal yazı giriş kutusu." },
      { code: 'type="password"', desc: "Yazılan karakterleri güvenlik için nokta/yıldız (•••) olarak gizler." }
    ],
    hint: '<label for="sname">Ad Soyad:</label> ve <input type="text" id="sname" name="sname"> yaz. Aynı şekilde id="spin" olan bir type="password" alanı ekle.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <form action="/register.php" method="post">
    <fieldset>
      <legend>Öğrenci Girişi</legend>
      <!-- 1) id="sname" olan text input ve ona bağlı label yaz -->
      <label for="sname">Student Name:</label><br>
      
      <br><br>
      <!-- 2) id="spin" olan password input ve ona bağlı label yaz -->
      
    </fieldset>
  </form>
</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <form action="/register.php" method="post">
    <fieldset>
      <legend>Öğrenci Girişi</legend>
      <label for="sname">Student Name:</label><br>
      <input type="text" id="sname" name="sname" value="Ahmet"><br><br>

      <label for="spin">Student PIN:</label><br>
      <input type="password" id="spin" name="spin">
    </fieldset>
  </form>
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "<code>type=\"text\"</code> ve <code>name</code> niteliğine sahip bir <code>&lt;input&gt;</code> ekle.",
        check: (doc) => !!doc.querySelector('input[type="text"][name]')
      },
      {
        label: "<code>&lt;label for=\"...\"&gt;</code> niteliğini yukarıdaki text input'un <code>id</code>'si ile eşleştir.",
        check: (doc) => {
          const inp = doc.querySelector('input[type="text"][id]');
          if (!inp) return false;
          const id = inp.getAttribute("id");
          return !!doc.querySelector(`label[for="${id}"]`);
        }
      },
      {
        label: "<code>type=\"password\"</code> ve <code>id</code>/<code>name</code> içeren şifre alanı + eşleşen <code>&lt;label&gt;</code> ekle.",
        check: (doc) => {
          const pwd = doc.querySelector('input[type="password"][id][name]');
          if (!pwd) return false;
          const id = pwd.getAttribute("id");
          return !!doc.querySelector(`label[for="${id}"]`);
        }
      }
    ]
  },

  {
    id: 7,
    module: "Modül 2: HTML5 Formları",
    examTag: "Vize Odağı",
    title: "Adım 7: Radio, Checkbox, Select, Textarea ve Butonlar",
    slideRef: "Week 2-1 • HTML Basics (Slayt 48-52, 60-63)",
    meaning: `
      <strong>VİZE FAVORİSİ:</strong> Farkı asla karıştırma:<br>
      • <code>type="radio"</code>: Seçeneklerden <strong>SADECE BİRİNİ</strong> seçtirir. Aynı gruptakilerin <code>name</code> değeri <strong>AYNI</strong> olmak zorundadır (ör. ikisi de <code>name="track"</code>).<br>
      • <code>type="checkbox"</code>: Kullanıcının <strong>SIFIR veya BİRDEN FAZLA</strong> kutu işaretlemesini sağlar.<br>
      • <code>&lt;select&gt;</code> açılır liste açar; içindeki her seçenek <code>&lt;option&gt;</code> olur ve varsayılan seçili olana <code>selected</code> yazılır.<br>
      • <code>&lt;textarea rows="4" cols="35"&gt;</code> çok satırlı yazı kutusudur.<br>
      • <code>type="submit"</code> formu gönderir, <code>type="reset"</code> tüm kutuları başlangıç haline sıfırlar!
    `,
    tokens: [
      { code: 'type="radio"', desc: "Tekli seçim yuvarlağı. Aynı 'name' verilen seçeneklerden sadece biri seçilebilir." },
      { code: 'type="checkbox"', desc: "Çoklu seçim kutucuğu. İstenilen sayıda seçenek işaretlenebilir." },
      { code: "<select> / <option>", desc: "Açılır liste kutusu. Bir seçeneği baştan seçili yapmak için <option selected> yazılır." },
      { code: "<textarea rows cols>", desc: "Çok satırlı metin kutusu. rows = görünür satır sayısı, cols = genişlik." },
      { code: 'type="submit" / "reset"', desc: "submit = formu action adresine yollar; reset = formu ilk değerlerine sıfırlar." }
    ],
    hint: 'İki tane aynı name="track" radio butonu, en az 1 checkbox, bir <select> (içinde selected olan bir <option>), bir <textarea rows="4" cols="35"></textarea> ve hem submit hem reset butonu ekle.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <form action="/register.php" method="post">
    <p>Alan Seçimi (Sadece 1 tane - Radio):</p>
    <input type="radio" id="web" name="track" value="Web">
    <label for="web">Web</label>
    <!-- İkinci radio butonunu AYNI name="track" ile ekle -->

    <p>Yetenekler (Çoklu - Checkbox):</p>
    <!-- En az 1 checkbox ekle -->

    <p>Bölüm (Açılır Liste - Select):</p>
    <!-- <select> içinde 2 <option> ve birinde selected yaz -->

    <p>Notunuz:</p>
    <!-- <textarea rows="4" cols="35"> ekle -->

    <br><br>
    <!-- submit ve reset butonları ekle -->
  </form>
</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <form action="/register.php" method="post">
    <p>Alan Seçimi (Tekli - Radio):</p>
    <input type="radio" id="web" name="track" value="Web">
    <label for="web">Web</label>
    <input type="radio" id="ai" name="track" value="AI">
    <label for="ai">AI</label>

    <p>Yetenekler (Çoklu - Checkbox):</p>
    <input type="checkbox" id="sk1" name="skill1" value="HTML5">
    <label for="sk1">HTML5</label>
    <input type="checkbox" id="sk2" name="skill2" value="CSS3">
    <label for="sk2">CSS3</label>

    <p>Bölüm:</p>
    <select name="dept" id="dept">
      <option value="ceng">Computer Eng.</option>
      <option value="seng" selected>Software Eng.</option>
    </select>

    <p>Notunuz:</p>
    <textarea name="notes" rows="4" cols="35">Kayıt notu...</textarea>

    <br><br>
    <input type="submit" value="Register">
    <input type="reset" value="Clear">
  </form>
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "Aynı <code>name</code> değerine sahip en az 2 adet <code>type=\"radio\"</code> ekle.",
        check: (doc) => {
          const radios = [...doc.querySelectorAll('input[type="radio"][name]')];
          if (radios.length < 2) return false;
          const counts = {};
          radios.forEach((r) => {
            const n = r.getAttribute("name");
            counts[n] = (counts[n] || 0) + 1;
          });
          return Object.values(counts).some((c) => c >= 2);
        }
      },
      {
        label: "En az 1 adet <code>type=\"checkbox\"</code> ekle.",
        check: (doc) => doc.querySelectorAll('input[type="checkbox"]').length >= 1
      },
      {
        label: "<code>&lt;select&gt;</code> içinde <code>selected</code> niteliğine sahip en az bir <code>&lt;option&gt;</code> ekle.",
        check: (doc) => !!doc.querySelector("select option[selected]")
      },
      {
        label: "<code>rows</code> ve <code>cols</code> niteliklerine sahip bir <code>&lt;textarea&gt;</code> ekle.",
        check: (doc) => !!doc.querySelector("textarea[rows][cols]")
      },
      {
        label: "Hem <code>type=\"submit\"</code> hem <code>type=\"reset\"</code> butonları ekle.",
        check: (doc) =>
          !!doc.querySelector('input[type="submit"], button[type="submit"]') &&
          !!doc.querySelector('input[type="reset"], button[type="reset"]')
      }
    ]
  },

  {
    id: 8,
    module: "Modül 2: HTML5 Formları",
    examTag: "",
    title: "Adım 8: HTML5 Datalist & Output Elemanları",
    slideRef: "Week 2-1 • HTML Basics (Slayt 46-47, 55-56)",
    meaning: `
      HTML5 ile gelen iki özel form yardımcısı:<br>
      • <code>&lt;datalist&gt;</code>: Bir <code>&lt;input&gt;</code> kutusuna yazı yazarken kullanıcıya hazır öneri listesi çıkarır. Bağlantı, <code>&lt;input list="listeId"&gt;</code> ile <code>&lt;datalist id="listeId"&gt;</code> eşleşerek kurulur.<br>
      • <code>&lt;output&gt;</code>: Bir hesaplamanın (örneğin iki sayının toplamının) sonucunu göstermek için kullanılır.
    `,
    tokens: [
      { code: '<input list="x">', desc: "Yazı kutusunu aynı id'li <datalist> öneri listesine bağlar." },
      { code: '<datalist id="x">', desc: "İçindeki <option value=\"...\"> elemanlarını otomatik tamamlama önerisi olarak sunar." },
      { code: "<output>", desc: "Form içindeki bir hesaplama sonucunu ekranda gösteren semantik etikettir." },
      { code: 'type="number"', desc: "Sadece sayı girişi ve yukarı/aşağı artırma okları sunar." }
    ],
    hint: '<input list="browsers" name="browser"> altına <datalist id="browsers"> açıp içine 2 <option value="Chrome"> ve <option value="Firefox"> yaz. Ayrıca bir <output> ekle.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <form oninput="x.value=parseInt(a.value)+parseInt(b.value)">
    <label for="br">Tarayıcı Seç (Yazmaya başla):</label>
    <input list="browsers" id="br" name="browser">
    <!-- Buraya id="browsers" olan <datalist> ve içine <option value="..."> ekle -->

    <hr>
    <p>Anlık Toplama Hesabı:</p>
    <input type="number" id="a" value="40"> +
    <input type="number" id="b" value="60"> =
    <!-- Buraya name="x" for="a b" olan <output> ekle -->
    
  </form>
</body>
</html>`,
    starterCss: ``,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <form oninput="x.value=parseInt(a.value)+parseInt(b.value)">
    <label for="br">Tarayıcı Seç:</label>
    <input list="browsers" id="br" name="browser">
    <datalist id="browsers">
      <option value="Chrome">
      <option value="Firefox">
      <option value="Edge">
    </datalist>

    <hr>
    <p>Anlık Toplama Hesabı:</p>
    <input type="number" id="a" value="40"> +
    <input type="number" id="b" value="60"> =
    <output name="x" for="a b">100</output>
  </form>
</body>
</html>`,
    solutionCss: ``,
    tasks: [
      {
        label: "<code>&lt;input list=\"browsers\"&gt;</code> ile eşleşen <code>&lt;datalist id=\"browsers\"&gt;</code> ekle.",
        check: (doc) => !!doc.querySelector('input[list="browsers"]') && !!doc.querySelector("datalist#browsers")
      },
      {
        label: "<code>&lt;datalist&gt;</code> içinde en az 2 adet <code>&lt;option&gt;</code> bulunsun.",
        check: (doc) => doc.querySelectorAll("datalist option").length >= 2
      },
      {
        label: "Hesaplama sonucunu göstermek için <code>&lt;output&gt;</code> etiketi ekle.",
        check: (doc) => !!doc.querySelector("output")
      }
    ]
  },

  // ===================== MODÜL 3: CSS TEMELLERİ & SEÇİCİLER =====================
  {
    id: 9,
    module: "Modül 3: CSS & Seçiciler",
    examTag: "",
    title: "Adım 9: CSS Kural Yapısı ve 3 Yerleştirme Yöntemi",
    slideRef: "Cascading Style Sheets-1 (Slayt 2-6)",
    meaning: `
      HTML binanın duvarıysa, <strong>CSS</strong> (Cascading Style Sheets) boyası ve dekorasyonudur.<br>
      Her CSS kuralı şöyle yazılır: <code>seçici { özellik: değer; }</code><br>
      Örnek: <code>h1 { color: navy; font-size: 24px; }</code><br>
      CSS'i HTML'e eklemenin <strong>3 yolu</strong> vardır:<br>
      1. <strong>Inline CSS:</strong> Doğrudan etiketin içine <code>style="color:red;"</code> yazılır (en yüksek öncelik).<br>
      2. <strong>Internal CSS:</strong> HTML içindeki <code>&lt;head&gt;</code> bölümünde <code>&lt;style&gt;...&lt;/style&gt;</code> bloğu açılır.<br>
      3. <strong>External CSS:</strong> Ayrı <code>.css</code> dosyası yazılır ve HTML'in <code>&lt;head&gt;</code> kısmına <code>&lt;link rel="stylesheet" href="mystyle.css"&gt;</code> konur. (Bu laboratuvarda sağdaki CSS sekmesi sayfaya otomatik bağlanır!)
    `,
    tokens: [
      { code: "selector { prop: val; }", desc: "CSS kural sözdizimi: Hangi elemanı seçeceğin + { neyi değiştireceğin: yeni değer; }" },
      { code: 'style="..."', desc: "Inline CSS: Tek bir etikete doğrudan stil vermek için kullanılır." },
      { code: "<style>...</style>", desc: "Internal CSS: Tek bir HTML sayfasına özel stilleri <head> içinde tanımlamak için." },
      { code: '<link rel="stylesheet">', desc: "External CSS: Birden fazla HTML sayfasını tek bir .css dosyasıyla yönetmek için <head> içine yazılır." }
    ],
    hint: "HTML'de <p style=\"color: red;\"> yazarak Inline CSS dene. Sonra CSS sekmesine geçip h1 { color: navy; } ve body { background-color: #f8fafc; } kurallarını yaz!",
    starterHtml: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Giriş</title>
</head>
<body>
  <h1>Merhaba CSS!</h1>
  <p>Bu paragrafı Inline CSS (style özelliği) ile kırmızı yap.</p>
</body>
</html>`,
    starterCss: `/* GÖREV: h1 başlığını lacivert (navy) yap, body arka planını aç */
body {
  
}

h1 {
  
}`,
    solutionHtml: `<!DOCTYPE html>
<html>
<head>
  <title>CSS Giriş</title>
</head>
<body>
  <h1>Merhaba CSS!</h1>
  <p style="color: red;">Bu paragraf Inline CSS (style="color: red;") ile kırmızı yapıldı.</p>
</body>
</html>`,
    solutionCss: `body {
  background-color: #f0f9ff;
}

h1 {
  color: navy;
}`,
    tasks: [
      {
        label: "HTML'deki <code>&lt;p&gt;</code> etiketine Inline CSS (<code>style=\"...\"</code>) ile renk ver.",
        check: (doc) => {
          const p = doc.querySelector("p[style]");
          return !!(p && /color\s*:/i.test(p.getAttribute("style")));
        }
      },
      {
        label: "CSS sekmesinde <code>body</code> seçicisine <code>background-color</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, "body", "background-color")
      },
      {
        label: "CSS sekmesinde <code>h1</code> seçicisine <code>color</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, "h1", "color")
      }
    ]
  },

  {
    id: 10,
    module: "Modül 3: CSS & Seçiciler",
    examTag: "Vize Odağı",
    title: "Adım 10: Temel CSS Seçiciler (*, element, .class, #id, grup)",
    slideRef: "Cascading Style Sheets-1 (Slayt 7-12)",
    meaning: `
      <strong>VİZE KODLAMA ANAHTARI:</strong> CSS seçiciler, stilin hangi HTML elemanına uygulanacağını hedefler:<br>
      • <code>*</code> (Universal): Sayfadaki <strong>TÜM</strong> elemanları seçer (ör. yazı tipini eşitlemek için).<br>
      • <code>p</code> (Element): Sayfadaki tüm <code>&lt;p&gt;</code> etiketlerini seçer.<br>
      • <code>#ozel</code> (ID Selector): Başında <strong>kare (#)</strong> vardır. <code>id="ozel"</code> olan TEK elemanı seçer.<br>
      • <code>.kutu</code> (Class Selector): Başında <strong>nokta (.)</strong> vardır. <code>class="kutu"</code> olan TÜM elemanları seçer.<br>
      • <code>h1, h2</code> (Grouping): Virgülle ayrılan tüm seçicilere aynı stili uygular!
    `,
    tokens: [
      { code: "*", desc: "Universal Selector: Sayfadaki istisnasız bütün HTML elemanlarını seçer." },
      { code: "p / h1 / div", desc: "Element Selector: Etiket adına göre seçim yapar." },
      { code: "#para1", desc: "ID Selector: Başına '#' koyarak sadece id='para1' olan tekil elemanı seçer." },
      { code: ".highlight", desc: "Class Selector: Başına '.' koyarak class='highlight' olan bütün elemanları seçer." },
      { code: "h1, h2, p", desc: "Grouping Selector: Aynı stili paylaşan elemanları virgülle gruplar." }
    ],
    hint: "CSS sekmesine * { font-family: Arial; }, #main-title { color: crimson; }, .card { border: 2px solid #0284c7; padding: 10px; } ve h1, p { margin-bottom: 10px; } yaz.",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h1 id="main-title">CSS Seçiciler</h1>
  <div class="card">
    <p>Bu birinci karttaki paragraf.</p>
  </div>
  <div class="card">
    <p>Bu ikinci karttaki paragraf.</p>
  </div>
</body>
</html>`,
    starterCss: `/* 1) Evrensel seçici (*) ile tüm elemanlara font-family ver */

/* 2) ID seçici (#main-title) ile başlığın rengini (color) değiştir */

/* 3) Class seçici (.card) ile kartlara kenarlık (border) ve iç boşluk (padding) ver */

/* 4) Gruplama seçici (h1, p) ile h1 ve p elemanlarına ortak margin veya text-align ver */`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h1 id="main-title">CSS Seçiciler</h1>
  <div class="card">
    <p>Bu birinci karttaki paragraf.</p>
  </div>
  <div class="card">
    <p>Bu ikinci karttaki paragraf.</p>
  </div>
</body>
</html>`,
    solutionCss: `* {
  font-family: Arial, sans-serif;
}

#main-title {
  color: crimson;
}

.card {
  border: 2px solid #0284c7;
  padding: 10px;
  margin-bottom: 8px;
}

h1, p {
  text-align: center;
}`,
    tasks: [
      {
        label: "Evrensel seçici <code>*</code> ile <code>font-family</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, "*", "font-family")
      },
      {
        label: "ID seçicisi <code>#main-title</code> ile <code>color</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, "#main-title", "color")
      },
      {
        label: "Class seçicisi <code>.card</code> ile <code>border</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, ".card", "border")
      },
      {
        label: "Gruplama seçicisi <code>h1, p</code> kullanarak ortak stil kuralı yaz.",
        check: (_d, _h, css) => hasCssRule(css, "h1, p", "")
      }
    ]
  },

  {
    id: 11,
    module: "Modül 3: CSS & Seçiciler",
    examTag: "Vize Odağı",
    title: "Adım 11: Attribute (Nitelik) Seçiciler ([attr^=], $=, *=)",
    slideRef: "Cascading Style Sheets-1 (Slayt 13-20)",
    meaning: `
      <strong>VİZE ŞAMPİYONU:</strong> Bir elemana <code>class</code> veya <code>id</code> eklemeden, doğrudan HTML niteliğine bakarak stil verebilirsin!<br>
      • <code>[target]</code> → <code>target</code> niteliği olanları seçer.<br>
      • <code>input[type="password"]</code> → Tam olarak <code>type="password"</code> olanları seçer.<br>
      • <code>[id^="s"]</code> → <code>id</code> değeri <strong>"s" ile BAŞLAYAN</strong> (<code>^</code> = başlangıç) elemanları seçer.<br>
      • <code>[href$=".pdf"]</code> → <code>href</code> değeri <strong>".pdf" ile BİTEN</strong> (<code>$</code> = son) elemanları seçer.<br>
      • <code>[class*="btn"]</code> → <code>class</code> içinde herhangi bir yerde <strong>"btn" GEÇEN</strong> (<code>*</code> = içeren) elemanları seçer.
      <br><br><em>Not: Sağdaki <strong>"Seçici Röntgeni"</strong> sekmesine geçip bu seçicileri canlı deneyebilirsin.</em>
    `,
    tokens: [
      { code: '[type="password"]', desc: "Tam eşleşme: type niteliği birebir 'password' olan elemanları seçer." },
      { code: '[id^="s"]', desc: "Prefix (^=): id değeri 's' harfi ile BAŞLAYAN tüm elemanları seçer (ör. sname, spin)." },
      { code: '[href$=".pdf"]', desc: "Suffix ($=): href değeri '.pdf' ile BİTEN tüm linkleri seçer." },
      { code: '[class*="btn"]', desc: "Contains (*=): class değerinin içinde 'btn' geçen her elemanı seçer." },
      { code: '[title~="flower"]', desc: "Word (~=): title içinde boşlukla ayrılmış tam 'flower' kelimesi geçenleri seçer." }
    ],
    hint: 'CSS sekmesine [type="password"] { background-color: #fef9c3; }, [id^="s"] { border: 2px solid #0284c7; } ve a[href$=".pdf"] { color: crimson; } yaz.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <form>
    <label for="sname">Adınız (id="sname"):</label><br>
    <input type="text" id="sname" name="sname"><br><br>

    <label for="spin">Şifreniz (id="spin"):</label><br>
    <input type="password" id="spin" name="spin"><br><br>

    <a href="syllabus.pdf">Ders Programı (PDF)</a> |
    <a href="https://ostimteknik.edu.tr" target="_blank">Web Sitesi</a>
  </form>
</body>
</html>`,
    starterCss: `/* 1) Sadece şifre kutusunu ([type="password"]) açık sarı arka plan yap */

/* 2) id'si "s" harfiyle başlayan ([id^="s"]) tüm kutulara mavi border ver */

/* 3) ".pdf" ile biten (a[href$=".pdf"]) linki kırmızı (crimson) yap */`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <form>
    <label for="sname">Adınız (id="sname"):</label><br>
    <input type="text" id="sname" name="sname"><br><br>

    <label for="spin">Şifreniz (id="spin"):</label><br>
    <input type="password" id="spin" name="spin"><br><br>

    <a href="syllabus.pdf">Ders Programı (PDF)</a> |
    <a href="https://ostimteknik.edu.tr" target="_blank">Web Sitesi</a>
  </form>
</body>
</html>`,
    solutionCss: `[type="password"] {
  background-color: #fef9c3;
}

[id^="s"] {
  border: 2px solid #0284c7;
  padding: 5px;
}

a[href$=".pdf"] {
  color: crimson;
  font-weight: bold;
}`,
    tasks: [
      {
        label: "<code>[type=\"password\"]</code> seçicisi ile <code>background-color</code> ver.",
        check: (_d, _h, css) => hasCssRule(css, '[type="password"]', "background-color")
      },
      {
        label: "<code>[id^=\"s\"]</code> prefix seçicisi ile <code>border</code> ver.",
        check: (_d, _h, css) => hasCssRule(css, '[id^="s"]', "border")
      },
      {
        label: "<code>a[href$=\".pdf\"]</code> suffix seçicisi ile <code>color</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, 'a[href$=".pdf"]', "color") || hasCssRule(css, '[href$=".pdf"]', "color")
      }
    ]
  },

  {
    id: 12,
    module: "Modül 3: CSS & Seçiciler",
    examTag: "Vize Odağı",
    title: "Adım 12: Pseudo-class (:) ve Pseudo-element (::)",
    slideRef: "Cascading Style Sheets-1 (Slayt 21-35)",
    meaning: `
      Tek iki nokta (<code>:</code>) ile çift iki nokta (<code>::</code>) farkını öğrenelim:<br>
      • <strong>Pseudo-class (<code>:</code>)</strong> bir elemanın <strong>özel durumunu</strong> seçer: <code>:hover</code> (fare üstüne gelince), <code>:focus</code> (tıklanıp odaklanınca), <code>p:first-child</code> (ebeveyninin ilk çocuğu olan <code>p</code>).<br>
      • <strong>Pseudo-element (<code>::</code>)</strong> bir elemanın <strong>belli bir parçasını</strong> biçimlendirir: <code>::first-letter</code> (ilk harf), <code>::first-line</code> (ilk satır), <code>::before</code> (içerikten önce ekler), <code>::marker</code> (liste noktaları).
    `,
    tokens: [
      { code: ":hover", desc: "Kullanıcı fareyi elemanın üzerine getirdiğinde uygulanır (ör. button:hover)." },
      { code: ":first-child", desc: "Kapsayıcısının İLK çocuğu olan elemanı seçer (ör. p:first-child)." },
      { code: "::first-letter", desc: "Metnin sadece İLK HARFİNİ büyütür/renklendirir." },
      { code: "::before / ::after", desc: "Elemanın içeriğinin başına veya sonuna CSS 'content' ile yazı/simge ekler." },
      { code: "::marker", desc: "<ul> ve <ol> listelerindeki madde işaretlerini veya sayıları renklendirir." }
    ],
    hint: 'CSS sekmesine input[type="submit"]:hover { background-color: #15803d; color: white; }, legend::first-letter { font-size: 160%; color: crimson; } ve p:first-child { color: navy; } yaz.',
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <form>
    <fieldset>
      <legend>Başvuru</legend>
      <p>Bu fieldset içindeki ilk paragraf.</p>
      <p>Bu ikinci paragraf.</p>
      <input type="submit" value="Üzerime Gel (:hover)">
    </fieldset>
  </form>
</body>
</html>`,
    starterCss: `/* 1) İlk paragrafa (p:first-child) mavi veya lacivert renk ver */

/* 2) legend etiketinin ilk harfini (legend::first-letter) büyüt ve kırmızı yap */

/* 3) Gönder butonunun üzerine fare gelince (input[type="submit"]:hover) arka planını değiştir */
input[type="submit"] {
  background-color: #0284c7;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}
`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <form>
    <fieldset>
      <legend>Başvuru</legend>
      <p>Bu fieldset içindeki ilk paragraf.</p>
      <p>Bu ikinci paragraf.</p>
      <input type="submit" value="Üzerime Gel (:hover)">
    </fieldset>
  </form>
</body>
</html>`,
    solutionCss: `p:first-child {
  color: #0369a1;
  font-weight: bold;
}

legend::first-letter {
  color: crimson;
  font-size: 160%;
}

input[type="submit"] {
  background-color: #0284c7;
  color: white;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

input[type="submit"]:hover {
  background-color: #15803d;
}`,
    tasks: [
      {
        label: "<code>:first-child</code> pseudo-class seçicisi ile <code>p:first-child</code> kuralı yaz.",
        check: (_d, _h, css) => hasCssRule(css, "p:first-child", "")
      },
      {
        label: "<code>::first-letter</code> pseudo-elementi ile <code>legend::first-letter</code> kuralı yaz.",
        check: (_d, _h, css) => hasCssRule(css, "legend::first-letter", "")
      },
      {
        label: "<code>input[type=\"submit\"]:hover</code> ile fare üzerine gelme (hover) kuralı yaz.",
        check: (_d, _h, css) => hasCssRule(css, 'input[type="submit"]:hover', "")
      }
    ]
  },

  // ===================== MODÜL 4: KUTU MODELİ & LAYOUT =====================
  {
    id: 13,
    module: "Modül 4: Stil, Kutu Modeli & Layout",
    examTag: "",
    title: "Adım 13: Renkler (HEX/RGB/HSL), Font (px/em) ve Metin",
    slideRef: "Cascading Style Sheets-2 (Slayt 2-6, 31-47)",
    meaning: `
      CSS'te renkleri 4 şekilde yazabiliriz: İsim (<code>Tomato</code>), HEX (<code>#ff6347</code>), RGB (<code>rgb(255,99,71)</code>) ve şeffaflıklı RGBA/HSLA.<br>
      Yazı boyutu için <code>px</code> veya tarayıcı varsayılanına (16px) göre ölçeklenen <code>em</code> kullanılır: <strong><code>pixels / 16 = em</code></strong> (ör. 32px = 2em).<br>
      <code>text-decoration: none;</code> özellikle linklerin altındaki çizgiyi kaldırmak için kullanılır!
    `,
    tokens: [
      { code: "#rrggbb / rgb()", desc: "HEX (#ff6347) veya Kırmızı-Yeşil-Mavi ışık karışımı rgb(255, 99, 71)." },
      { code: "rgba(..., 0.5)", desc: "4. değer (alpha) 0.0 - 1.0 arasında şeffaflık belirler." },
      { code: "font-size: 2em", desc: "1em varsayılan 16px'tir. pixels/16 = em formülü ile hesaplanır." },
      { code: "text-decoration: none", desc: "Linklerin (<a>) altındaki varsayılan çizgiyi siler." },
      { code: "text-shadow", desc: "Metne gölge ekler: yatay dikey bulanıklık renk (ör. 2px 2px 4px #94a3b8)." }
    ],
    hint: "CSS sekmesinde h1'e HEX veya RGB renk + text-shadow ver, p'ye font-size: 1.25em yaz ve a etiketine text-decoration: none uygula.",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h1>Tipografi ve Renkler</h1>
  <p>Bu paragraf em birimiyle boyutlandırılacak.</p>
  <a href="#">Alt Çizgisiz Link Butonu</a>
</body>
</html>`,
    starterCss: `h1 {
  /* color (HEX veya rgb), text-align: center ve text-shadow ekle */
}

p {
  /* font-size değerini em cinsinden (ör: 1.25em) belirle */
}

a {
  /* text-decoration: none ile alt çizgiyi kaldır */
  background-color: #0284c7;
  color: white;
  padding: 8px 14px;
  display: inline-block;
}`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h1>Tipografi ve Renkler</h1>
  <p>Bu paragraf em birimiyle boyutlandırılacak (20px / 16 = 1.25em).</p>
  <a href="#">Alt Çizgisiz Link Butonu</a>
</body>
</html>`,
    solutionCss: `h1 {
  color: #b91c1c;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

p {
  font-size: 1.25em;
  font-family: Verdana, sans-serif;
}

a {
  text-decoration: none;
  background-color: #0284c7;
  color: white;
  padding: 8px 14px;
  display: inline-block;
}`,
    tasks: [
      {
        label: "<code>h1</code> için <code>text-shadow</code> özelliği ekle.",
        check: (_d, _h, css) => hasCssRule(css, "h1", "text-shadow")
      },
      {
        label: "<code>p</code> için <code>em</code> birimli bir <code>font-size</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, "p", /font-size:\s*[0-9.]+em/)
      },
      {
        label: "<code>a</code> etiketinde <code>text-decoration: none</code> kullan.",
        check: (_d, _h, css) => hasCssRule(css, "a", /text-decoration:\s*none/)
      }
    ]
  },

  {
    id: 14,
    module: "Modül 4: Stil, Kutu Modeli & Layout",
    examTag: "",
    title: "Adım 14: CSS Kutu Modeli (Margin, Border, Padding, Outline)",
    slideRef: "Cascading Style Sheets-2 (Slayt 9-30)",
    meaning: `
      CSS'te her HTML elemanı iç içe geçmiş bir <strong>KUTUDUR (Box Model)</strong>:<br>
      1. <strong>Content:</strong> İçindeki yazı/resim (<code>width</code> / <code>height</code>).<br>
      2. <strong>Padding:</strong> İçerik ile çerçeve arasındaki <strong>İÇ boşluk</strong>.<br>
      3. <strong>Border:</strong> Kutuyu saran çerçeve (ör. <code>border: 2px solid green; border-radius: 10px;</code>).<br>
      4. <strong>Margin:</strong> Kutunun dışındaki diğer elemanlarla olan <strong>DIŞ boşluk</strong>. (Not: <code>margin: 0 auto;</code> kutuyu yatayda ortalar!)<br>
      • <strong>Outline:</strong> Border'ın <em>dışına</em> çizilir ve elemanın toplam genişliğini DEĞİŞTİRMEZ.<br><br>
      <em>Not: Sağdaki <strong>"Kutu Modeli"</strong> sekmesinden bu katmanları sürgülerle canlı oynayabilirsin.</em>
    `,
    tokens: [
      { code: "padding", desc: "İçerik ile border arasındaki iç boşluktur." },
      { code: "border + border-radius", desc: "border: kalınlık stil renk (ör. 2px solid navy); border-radius ise köşeleri yuvarlatır." },
      { code: "margin: 20px auto", desc: "Dış boşluk. Sağ-sol 'auto' yapılınca genişliği belli olan kutu ortalanır." },
      { code: "outline", desc: "Border dışına çizilen, boyut hesabına katılmayan dış çizgidir." }
    ],
    hint: ".box sınıfına width: 260px, padding: 20px, border: 3px solid #0284c7, border-radius: 12px ve margin: 24px auto yaz!",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <div class="box">
    Bu kutunun iç boşluğu (padding), kenarlığı (border) ve dış boşluğu (margin) var!
  </div>
</body>
</html>`,
    starterCss: `.box {
  background-color: #e0f2fe;
  width: 260px;
  /* padding, border, border-radius ve margin ekle */
}`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <div class="box">
    Bu kutunun iç boşluğu (padding), kenarlığı (border) ve dış boşluğu (margin) var!
  </div>
</body>
</html>`,
    solutionCss: `.box {
  background-color: #e0f2fe;
  width: 260px;
  padding: 20px;
  border: 3px solid #0284c7;
  border-radius: 12px;
  margin: 24px auto;
}`,
    tasks: [
      {
        label: "<code>.box</code> seçicisine <code>padding</code> ekle.",
        check: (_d, _h, css) => hasCssRule(css, ".box", "padding")
      },
      {
        label: "<code>.box</code> seçicisine <code>border</code> ve <code>border-radius</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, ".box", "border:") && hasCssRule(css, ".box", "border-radius")
      },
      {
        label: "<code>.box</code> seçicisine <code>margin</code> ekle.",
        check: (_d, _h, css) => hasCssRule(css, ".box", "margin")
      }
    ]
  },

  {
    id: 15,
    module: "Modül 4: Stil, Kutu Modeli & Layout",
    examTag: "",
    title: "Adım 15: Semantik Düzen (&lt;header&gt;, &lt;nav&gt;, &lt;aside&gt;) & Display",
    slideRef: "CSS-2 (Slayt 55-56) • HTML and CSS Layout (Slayt 3-15)",
    meaning: `
      Her yeri <code>&lt;div&gt;</code> yapmak yerine tarayıcının ve arama motorlarının anlayacağı <strong>Semantik Etiketler</strong> kullanırız:<br>
      <code>&lt;header&gt;</code> (üst bant), <code>&lt;nav&gt;</code> (menü linkleri), <code>&lt;main&gt;</code> / <code>&lt;section&gt;</code> / <code>&lt;article&gt;</code> (ana içerik & bağımsız yazılar), <code>&lt;aside&gt;</code> (yan kenar çubuğu), <code>&lt;footer&gt;</code> (alt bilgi).<br><br>
      <strong>Display Farkı:</strong> <code>block</code> elemanlar (div, p, h1) yeni satırdan başlar ve tüm satırı kaplar. <code>inline</code> elemanlar (span, a) sadece içeriği kadar yer kaplar (width/height almaz). <code>inline-block</code> ise yan yana dizilir AMA genişlik/yükseklik alabilir!
    `,
    tokens: [
      { code: "<header> / <nav>", desc: "Sayfanın üst başlık bandı ve gezinme menüsü." },
      { code: "<section> / <article>", desc: "Bölüm (<section>) ve kendi başına anlamlı blog/haber içeriği (<article>)." },
      { code: "<aside>", desc: "Ana içerikten ayrı yan bilgi / kenar çubuğu (sidebar) veya reklam alanı." },
      { code: "<footer>", desc: "Telif hakkı ve alt bağlantıların bulunduğu en alt bölüm." },
      { code: "display: inline-block", desc: "Hem yan yana dizilir hem de width/height/padding değerlerini kabul eder." }
    ],
    hint: "HTML'de <header>, <nav>, <section> içinde <article>, bir <aside> ve en alta <footer> ekle. CSS'te nav a seçicisine display: inline-block ver.",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <header><h1>Web Blogum</h1></header>
  <nav>
    <a href="#">Ana Sayfa</a>
    <a href="#">Dersler</a>
  </nav>
  <section>
    <article>
      <h2>HTML5 Semantik Etiketler</h2>
      <p>Sayfayı anlamlı parçalara böler.</p>
    </article>
  </section>
  <!-- Buraya yan bilgi için <aside> ve en alta <footer> ekle -->
  
</body>
</html>`,
    starterCss: `header, footer {
  background-color: #1e293b;
  color: white;
  text-align: center;
  padding: 12px;
}

nav a {
  /* Menü linklerinin padding alabilmesi için display: inline-block yap */
  padding: 8px 12px;
  text-decoration: none;
  color: #0284c7;
}`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <header><h1>Web Blogum</h1></header>
  <nav>
    <a href="#">Ana Sayfa</a>
    <a href="#">Dersler</a>
  </nav>
  <section>
    <article>
      <h2>HTML5 Semantik Etiketler</h2>
      <p>Sayfayı anlamlı parçalara böler.</p>
    </article>
  </section>
  <aside>
    <h3>Hızlı Not</h3>
    <p>aside etiketi yan çubuk (sidebar) içindir.</p>
  </aside>
  <footer>
    <p>&copy; 2026 Web Programming Lab</p>
  </footer>
</body>
</html>`,
    solutionCss: `header, footer {
  background-color: #1e293b;
  color: white;
  text-align: center;
  padding: 12px;
}

nav a {
  display: inline-block;
  padding: 8px 12px;
  text-decoration: none;
  color: #0284c7;
  font-weight: bold;
}`,
    tasks: [
      {
        label: "Sayfada <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code> ve <code>&lt;article&gt;</code> etiketleri bulunsun.",
        check: (doc) => !!doc.querySelector("header") && !!doc.querySelector("nav") && !!doc.querySelector("article")
      },
      {
        label: "Yan içerik için <code>&lt;aside&gt;</code> ve alt bilgi için <code>&lt;footer&gt;</code> ekle.",
        check: (doc) => !!doc.querySelector("aside") && !!doc.querySelector("footer")
      },
      {
        label: "CSS'te <code>nav a</code> için <code>display: inline-block</code> tanımla.",
        check: (_d, _h, css) => hasCssRule(css, "nav a", /display:\s*inline-block/)
      }
    ]
  },

  {
    id: 16,
    module: "Modül 4: Stil, Kutu Modeli & Layout",
    examTag: "FİNAL SİMÜLASYON",
    title: "Adım 16: Flex / Grid ve Vize Kodlama Final Sınavı",
    slideRef: "CSS Layout (Slayt 6-8) • Vize 20 Puanlık Kodlama Hazırlığı",
    meaning: `
      <strong>TEBRİKLER, SON ADIMA GELDİN!</strong> Modern sayfa düzeninde <code>display: flex</code> (tek eksenli yan yana/alt alta dizilim) ve <code>display: grid</code> (satır & sütun ızgarası, ör. <code>grid-template-columns: 2fr 1fr 1fr;</code>) kullanılır.<br><br>
      Bu final laboratuvarında hocanın vizede <strong>20 puan</strong> üzerinden soracağı <strong>Form Yapısı + CSS Seçiciler + Layout</strong> becerilerinin tamamını tek sayfada birleştireceksin!
    `,
    tokens: [
      { code: "display: flex", desc: "Kapsayıcı içindeki elemanları esnek şekilde yatay (row) veya dikey (column) hizalar." },
      { code: "display: grid", desc: "2 boyutlu ızgara düzeni. '2fr 1fr 1fr' ilk sütuna 2 pay, diğer ikisine 1'er pay verir." },
      { code: "position: relative", desc: "Elemanı normal akışta bulunduğu yere göre top/left değerleriyle kaydırır." },
      { code: "Final Kontrolü", desc: "Form (post + fieldset + legend + radio + submit) + CSS ([id^='s'], ::first-letter, :hover, flex)!" }
    ],
    hint: ".grid-cards sınıfına display: grid; grid-template-columns: 1fr 1fr; gap: 10px; ekle. HTML'deki forma method=\"post\", fieldset+legend, id=\"sname\" input, 2 radio ve CSS'te [id^=\"s\"] + input[type=\"submit\"]:hover kurallarını tamamla!",
    starterHtml: `<!DOCTYPE html>
<html>
<body>
  <h2>Vize Kodlama Final Görevi</h2>
  <div class="grid-cards">
    <div class="info-box"><strong>Kural 1:</strong> Form yapısı tam olmalı</div>
    <div class="info-box"><strong>Kural 2:</strong> Seçiciler doğru hedeflenmeli</div>
  </div>

  <!-- Buraya action="/submit.php" method="post" olan form yaz -->
  <form>
    <fieldset>
      <legend>Exam Registration</legend>
      <label for="sname">Student Name:</label><br>
      <input type="text" id="sname" name="sname"><br><br>

      <label for="spin">PIN Code:</label><br>
      <input type="password" id="spin" name="spin"><br><br>

      <!-- Aynı name'li 2 radio butonu ve bir submit butonu ekle -->
      
    </fieldset>
  </form>
</body>
</html>`,
    starterCss: `.grid-cards {
  /* display: grid ve grid-template-columns: 1fr 1fr; ekle */
  gap: 10px;
  margin-bottom: 14px;
}

.info-box {
  background: #e0f2fe;
  padding: 10px;
  border-radius: 6px;
}

/* id'si "s" ile başlayanlara ([id^="s"]) border ver */

/* legend ilk harfini (legend::first-letter) renklendir */

/* submit butonuna :hover stili ekle */
`,
    solutionHtml: `<!DOCTYPE html>
<html>
<body>
  <h2>Vize Kodlama Final Görevi</h2>
  <div class="grid-cards">
    <div class="info-box"><strong>Kural 1:</strong> Form yapısı tam olmalı</div>
    <div class="info-box"><strong>Kural 2:</strong> Seçiciler doğru hedeflenmeli</div>
  </div>

  <form action="/submit.php" method="post">
    <fieldset>
      <legend>Exam Registration</legend>
      <label for="sname">Student Name:</label><br>
      <input type="text" id="sname" name="sname"><br><br>

      <label for="spin">PIN Code:</label><br>
      <input type="password" id="spin" name="spin"><br><br>

      <input type="radio" id="secA" name="section" value="A">
      <label for="secA">Section A</label>
      <input type="radio" id="secB" name="section" value="B">
      <label for="secB">Section B</label><br><br>

      <input type="submit" value="Complete Exam">
    </fieldset>
  </form>
</body>
</html>`,
    solutionCss: `.grid-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
}

.info-box {
  background: #e0f2fe;
  padding: 10px;
  border-radius: 6px;
}

[id^="s"] {
  border: 2px solid #0284c7;
  padding: 6px;
  border-radius: 4px;
}

legend::first-letter {
  color: #b91c1c;
  font-size: 150%;
}

input[type="submit"] {
  background: #0284c7;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

input[type="submit"]:hover {
  background: #15803d;
}`,
    tasks: [
      {
        label: "CSS'te <code>.grid-cards</code> için <code>display: grid</code> ve <code>grid-template-columns</code> tanımla.",
        check: (_d, _h, css) =>
          hasCssRule(css, ".grid-cards", /display:\s*grid/) &&
          hasCssRule(css, ".grid-cards", "grid-template-columns")
      },
      {
        label: "Formda <code>action</code>, <code>method=\"post\"</code>, <code>&lt;fieldset&gt;</code> ve <code>&lt;legend&gt;</code> bulunsun.",
        check: (doc) =>
          !!doc.querySelector('form[action][method="post" i] fieldset legend')
      },
      {
        label: "Aynı <code>name</code> değerine sahip 2 <code>radio</code> butonu ve bir <code>submit</code> butonu ekle.",
        check: (doc) => {
          const radios = [...doc.querySelectorAll('input[type="radio"][name]')];
          const hasPair = radios.length >= 2 && new Set(radios.map((r) => r.getAttribute("name"))).size < radios.length;
          return hasPair && !!doc.querySelector('input[type="submit"]');
        }
      },
      {
        label: "CSS'te <code>[id^=\"s\"]</code>, <code>legend::first-letter</code> ve <code>input[type=\"submit\"]:hover</code> kurallarını yaz.",
        check: (_d, _h, css) =>
          hasCssRule(css, '[id^="s"]', "") &&
          hasCssRule(css, "legend::first-letter", "") &&
          hasCssRule(css, 'input[type="submit"]:hover', "")
      }
    ]
  }
];
