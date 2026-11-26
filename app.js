(function () {
  "use strict";

  var CFG = window.CRYSTAL_CONFIG || {};
  var keys = { customers: "crystal_customers", bookings: "crystal_bookings", events: "crystal_events", inspiration: "crystal_inspiration", captions: "crystal_captions", products: "crystal_products", story: "crystal_story", accounts: "crystal_accounts" };
  var publishedContent = {};
  var publishedContentLoaded = false;
  var publishedContentError = "";
  var githubToken = "";
  var works = [
    { id: "afterglow", name: "Afterglow", category: "Evening", image: "assets/img-2.jpg", tagline: "A little midnight magic.", recipient: "the woman who owns the room.", description: "An emerald lace silhouette with thoughtful details for the moments that deserve a little extra sparkle.", relatedAccessories: ["aso-oke-clutch", "cowrie-necklace", "beaded-headwrap"] },
    { id: "aster", name: "Aster", category: "Celebration", image: "assets/img-1iu.jpg", images: ["assets/img-1iu.jpg", "assets/img-1.jpg"], tagline: "The joy is in the details.", recipient: "her next beautiful beginning.", description: "A playful, sculpted look made for dancing, celebrating, and feeling completely yourself.", relatedAccessories: ["ankara-scrunchies", "beaded-headwrap", "cowrie-necklace"] },
    { id: "solenne", name: "Solenne", category: "Occasion", image: "assets/img-1.jpg", images: ["assets/img-1.jpg", "assets/img-1iu.jpg"], tagline: "Colour with a point of view.", recipient: "the woman who brings the colour.", description: "A bold print and a beautifully considered shape, designed to turn an entrance into a moment.", relatedAccessories: ["adire-tote", "ankara-scrunchies", "aso-oke-clutch"] },
    { id: "celeste", name: "Celeste", category: "Celebration", image: "assets/img-3.jpg", tagline: "Softness, with a little fire.", recipient: "the one celebrating herself.", description: "Romantic lace and a confident silhouette, balanced with the details that make it yours.", relatedAccessories: ["beaded-headwrap", "cowrie-necklace", "aso-oke-clutch"] },
    { id: "sunday-light", name: "Sunday Light", category: "Occasion", image: "assets/img-1iu.jpg", images: ["assets/img-1iu.jpg", "assets/img-1.jpg"], tagline: "A reason to make a memory.", recipient: "a day she’ll talk about forever.", description: "A made-to-measure occasion look with a graceful line and room for your own signature.", relatedAccessories: ["cowrie-necklace", "ankara-scrunchies", "adire-tote"] },
    { id: "the-gathering", name: "The Gathering", category: "Evening", image: "assets/img-2.jpg", tagline: "Made for all the right reasons.", recipient: "the woman bringing everyone together.", description: "A statement-making evening piece, imagined around your occasion, your palette, and your point of view.", relatedAccessories: ["aso-oke-clutch", "adire-tote", "beaded-headwrap"] }
  ];
  var accessories = [
    { id: "aso-oke-clutch", name: "Aso Oke Clutch", category: "Bags", type: "clutch", price: 18000, tagline: "A little heirloom in the making." },
    { id: "beaded-headwrap", name: "Beaded Headwrap", category: "Hair", type: "headwrap", price: 9500, tagline: "A sparkle for your everyday." },
    { id: "adire-tote", name: "Adire Tote", category: "Bags", type: "tote", price: 16500, tagline: "Carry a little colour with you." },
    { id: "cowrie-necklace", name: "Cowrie Statement Necklace", category: "Jewellery", type: "necklace", price: 12000, tagline: "A keepsake with a story." },
    { id: "ankara-scrunchies", name: "Ankara Scrunchie Set", category: "Hair", type: "scrunchie", price: 6500, tagline: "Small joy, tied up in a bow." }
  ];
  var storyDefaults = {
    copy: {
      heroEyebrow: "OUR STORY · BUKOLA CRYSTAL ATELIER",
      heroTitle: "The woman is the beginning.",
      heroTitleAccent: "The story is the design.",
      heroIntro: "Every look starts with a person, a moment and the feeling she wants to carry with her.",
      ribbon: "HER STORY ✦ YOUR MOMENT ✦ MADE WITH CARE ✦ A LITTLE SPARKLE ✦ HER STORY ✦ YOUR MOMENT ✦ MADE WITH CARE ✦ A LITTLE SPARKLE ✦",
      chapterOneEyebrow: "HOW IT BEGINS",
      chapterOneHeading: "First, we listen to",
      chapterOneAccent: "your story.",
      chapterOneParagraphOne: "A celebration, a new beginning, or a day you simply want to feel like yourself—what matters to you is where the design starts.",
      chapterOneParagraphTwo: "We talk through the occasion, the details you love and how you want to feel. From there, your idea begins to take shape as a custom look made around you.",
      chapterOneImageNote: "A moment\nmade hers.",
      chapterOneLink: "Bring us your idea",
      chapterTwoEyebrow: "THE CRAFT",
      chapterTwoHeading: "From the first idea",
      chapterTwoAccent: "to the final fitting.",
      chapterTwoParagraphOne: "We bring your inspiration into the design process, shaping the silhouette, colour and details around the person who will wear it.",
      chapterTwoParagraphTwo: "Each fitting gives us a chance to refine the feel and finish, so your custom piece feels considered, comfortable and unmistakably yours.",
      chapterTwoImageNote: "Thought through.\nMade with care.",
      chapterTwoLink: "Plan a fitting",
      chapterThreeEyebrow: "THE FINISHING TOUCH",
      chapterThreeHeading: "Details that feel",
      chapterThreeAccent: "like you.",
      chapterThreeParagraphOne: "The right finishing touch can bring the whole look together. Explore thoughtful accessories, or tell us what would make your outfit feel complete.",
      chapterThreeParagraphTwo: "Whether you have a clear picture in mind or are still finding the words for it, there is room to make something personal.",
      chapterThreeImageNote: "The little things\nmake it yours.",
      chapterThreeLink: "Explore accessories",
      valueOneTitle: "Designed around you",
      valueOneText: "Your occasion, your point of view.",
      valueTwoTitle: "Made with care",
      valueTwoText: "Thoughtful details at every fitting.",
      valueThreeTitle: "Finished with feeling",
      valueThreeText: "A look that stays with you.",
      journeyEyebrow: "A CUSTOM LOOK, STEP BY STEP",
      journeyHeading: "From your first thought",
      journeyAccent: "to your moment.",
      stepOneTitle: "Share the idea",
      stepOneText: "Tell us what you are celebrating and what you have in mind.",
      stepTwoTitle: "Shape the design",
      stepTwoText: "We talk through the silhouette, details and direction together.",
      stepThreeTitle: "Make it yours",
      stepThreeText: "At your fitting, we refine the look around you.",
      stepFourTitle: "Step into the moment",
      stepFourText: "Your finished look is ready for the story ahead.",
      closingEyebrow: "WHEN YOU’RE READY",
      closingHeading: "Your story belongs",
      closingAccent: "in the details.",
      closingIntro: "Start with a fitting or tell us what you would love to create.",
      closingFittingLink: "Book a fitting",
      closingDesignLink: "Start a custom design"
    },
    images: {
      chapterOneImage: "assets/img-2.jpg",
      chapterTwoImage: "assets/img-1iu.jpg",
      chapterThreeImage: "assets/img-3.jpg"
    },
    alts: {
      chapterOneAlt: "An occasion look created for a memorable moment",
      chapterTwoAlt: "A colourful custom outfit with carefully finished details",
      chapterThreeAlt: "A softly detailed occasionwear look from the atelier"
    }
  };
  var accessoryPlaceholderImages = ["assets/img-1.jpg", "assets/img-1iu.jpg", "assets/img-2.jpg", "assets/img-3.jpg"];
  var $ = function (selector, root) { return (root || document).querySelector(selector); };
  var $$ = function (selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); };

  function read(key, fallback) {
    if (publishedContentLoaded) {
      var contentKey = key === keys.products ? "products" : key === keys.story ? "story" : key === keys.captions ? "captions" : "";
      if (contentKey && Object.prototype.hasOwnProperty.call(publishedContent, contentKey)) return publishedContent[contentKey];
    }
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }
  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }
  function contentApiUrl(path) {
    var github = CFG.github || {};
    var encodedPath = path.split("/").map(encodeURIComponent).join("/");
    return "https://api.github.com/repos/" + encodeURIComponent(github.owner || "") + "/" + encodeURIComponent(github.repository || "") + "/contents/" + encodedPath;
  }
  function loadPublishedContent() {
    var file = (CFG.github && CFG.github.contentFile) || "site-content.json";
    return fetch(file, { cache: "no-store" }).then(function (response) {
      if (!response.ok) throw new Error("Could not load shared site content (" + response.status + ").");
      return response.json();
    }).then(function (content) {
      if (!content || typeof content !== "object" || Array.isArray(content)) throw new Error("The shared site content file is not valid JSON data.");
      publishedContent = content;
      publishedContentLoaded = true;
    });
  }
  function githubApiRequest(method, path, body) {
    var headers = {
      Accept: "application/vnd.github+json",
      Authorization: "Bearer " + githubToken,
      "X-GitHub-Api-Version": "2022-11-28"
    };
    var options = { method: method, headers: headers };
    if (body) {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
    return fetch(path, options).then(function (response) {
      return response.text().then(function (text) {
        var result = {};
        if (text) {
          try { result = JSON.parse(text); }
          catch (error) { result = { message: text }; }
        }
        if (!response.ok) {
          var failure = new Error(result.message || "GitHub rejected the request (" + response.status + ").");
          failure.status = response.status;
          throw failure;
        }
        return result;
      });
    });
  }
  function getGitHubFile(path) {
    var branch = (CFG.github && CFG.github.branch) || "main";
    return githubApiRequest("GET", contentApiUrl(path) + "?ref=" + encodeURIComponent(branch));
  }
  function utf8Base64(value) {
    var bytes = new TextEncoder().encode(value);
    var binary = "";
    bytes.forEach(function (byte) { binary += String.fromCharCode(byte); });
    return window.btoa(binary);
  }
  function parseGitHubContentFile(file) {
    if (!file || !file.content) throw new Error("GitHub did not return the shared content file.");
    var binary = window.atob(file.content.replace(/\s/g, ""));
    var bytes = new Uint8Array(binary.length);
    for (var index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    var content = JSON.parse(new TextDecoder().decode(bytes));
    if (!content || typeof content !== "object" || Array.isArray(content)) throw new Error("The shared content file is not valid JSON data.");
    return content;
  }
  function normalizeAccessoryImages() {
    accessories.forEach(function (item, index) {
      var images = itemImages(item).filter(function (image, imageIndex, allImages) {
        return allImages.indexOf(image) === imageIndex;
      });
      for (var offset = 0; images.length < 3 && offset < accessoryPlaceholderImages.length; offset += 1) {
        var placeholder = accessoryPlaceholderImages[(index + offset) % accessoryPlaceholderImages.length];
        if (images.indexOf(placeholder) === -1) images.push(placeholder);
      }
      item.images = images;
      if (images.length) item.image = images[0];
    });
  }
  function installPublishedContent(content) {
    publishedContent = content;
    publishedContentLoaded = true;
    var catalog = read(keys.products, null);
    if (catalog && Array.isArray(catalog.works) && Array.isArray(catalog.accessories)) {
      works = catalog.works;
      accessories = catalog.accessories;
    }
    normalizeAccessoryImages();
  }
  function saveGitHubFile(path, content, message) {
    var branch = (CFG.github && CFG.github.branch) || "main";
    function put(sha) {
      var body = {
        message: message,
        content: utf8Base64(content),
        branch: branch
      };
      if (sha) body.sha = sha;
      return githubApiRequest("PUT", contentApiUrl(path), body);
    }
    return getGitHubFile(path).then(function (file) {
      return put(file.sha);
    }, function (error) {
      if (error.status !== 404) throw error;
      return put("");
    });
  }
  function publishImage(source) {
    var imageData = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(source);
    if (!imageData) return Promise.resolve(source);
    var github = CFG.github || {};
    var path = "assets/admin-upload-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
    var branch = github.branch || "main";
    return githubApiRequest("PUT", contentApiUrl(path), {
      message: "Add image uploaded from studio admin",
      content: imageData[1],
      branch: branch
    }).then(function () { return path; });
  }
  function publishImages(value, uploaded) {
    if (typeof value === "string" && value.indexOf("data:image/jpeg;base64,") === 0) {
      if (!uploaded[value]) {
        uploaded[value] = publishImage(value);
      }
      return uploaded[value];
    }
    if (Array.isArray(value)) {
      return Promise.all(value.map(function (entry) { return publishImages(entry, uploaded); }));
    }
    if (value && typeof value === "object") {
      var result = {};
      return Object.keys(value).reduce(function (chain, key) {
        return chain.then(function () {
          return publishImages(value[key], uploaded).then(function (published) { result[key] = published; });
        });
      }, Promise.resolve()).then(function () { return result; });
    }
    return Promise.resolve(value);
  }
  function publishSiteContent(changes) {
    if (!githubToken) return Promise.reject(new Error("Connect GitHub before saving changes to the live site."));
    var content = {
      products: { works: works, accessories: accessories },
      story: getStoryContent(),
      captions: read(keys.captions, {})
    };
    Object.keys(changes).forEach(function (key) { content[key] = changes[key]; });
    var file = (CFG.github && CFG.github.contentFile) || "site-content.json";
    return publishImages(content, {}).then(function (published) {
      return saveGitHubFile(file, JSON.stringify(published, null, 2) + "\n", "Publish studio content changes").then(function () {
        var storedContent = published;
        publishedContent = storedContent;
        publishedContentLoaded = true;
        if (storedContent.products) {
          works = storedContent.products.works;
          accessories = storedContent.products.accessories;
          write(keys.products, storedContent.products);
        }
        if (storedContent.story) write(keys.story, storedContent.story);
        if (storedContent.captions) write(keys.captions, storedContent.captions);
        return storedContent;
      });
    });
  }
  function setGitHubStatus(message) {
    var status = $("#github-publish-status");
    if (status) status.textContent = message;
  }
  function setAdminAccess(connected) {
    var root = $("#admin-root");
    if (!root) return;
    var activeTab = $(".admin-tab.active", root);
    Array.prototype.slice.call(root.children).forEach(function (element) {
      if (element.classList.contains("admin-section")) {
        var visible = connected && activeTab && element.id === "admin-" + activeTab.dataset.tab;
        element.hidden = !visible;
        element.style.display = visible ? "" : "none";
      } else if (element.classList.contains("admin-head") || element.classList.contains("admin-note")
        || element.classList.contains("admin-tabs")) {
        element.hidden = !connected;
        element.style.display = connected ? "" : "none";
      }
    });
  }
  function setupGitHubPublisher(root) {
    var github = CFG.github || {};
    root.insertAdjacentHTML("afterbegin", '<section class="admin-panel github-publisher"><p class="eyebrow">LIVE STOREFRONT PUBLISHING</p><h2>Connect to GitHub</h2><p class="catalog-help">Enter a fine-grained token with <b>Contents: read and write</b> access to ' + escapeHtml((github.owner || "") + "/" + (github.repository || "")) + ' on <b>' + escapeHtml(github.branch || "main") + '</b> to access the dashboard and publish changes. The token stays in this tab’s memory and is cleared when you disconnect or close the page; it is never saved to the site.</p><p class="admin-note">GitHub Pages cannot provide server-side authentication. Anyone with this token can publish to the repository, so use a narrowly scoped token only on a trusted device.</p><form id="github-publisher-form" class="product-form"><label>Fine-grained GitHub token<input name="token" type="password" autocomplete="new-password" spellcheck="false" required></label><div class="product-form-actions"><button class="button" type="submit">Connect <span>↗</span></button><button class="admin-btn" id="github-disconnect" type="button" hidden>Disconnect</button><span id="github-publish-status" aria-live="polite">' + escapeHtml(publishedContentError || "Dashboard locked. Connect GitHub to continue.") + '</span></div></form></section>');
    var form = $("#github-publisher-form", root);
    var disconnect = $("#github-disconnect", root);
    var connectButton = $('button[type="submit"]', form);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var token = String(form.elements.token.value || "").trim();
      if (!token) return;
      githubToken = token;
      form.elements.token.value = "";
      connectButton.disabled = true;
      setGitHubStatus("Checking repository access…");
      getGitHubFile(github.contentFile || "site-content.json").then(function (file) {
        installPublishedContent(parseGitHubContentFile(file));
        renderCollection();
        applyStoryContent();
        refreshAdmin();
        renderCatalogEditor();
        renderCaptionEditor();
        renderStoryEditor();
        setAdminAccess(true);
        disconnect.hidden = false;
        form.elements.token.required = false;
        connectButton.textContent = "Connected";
        setGitHubStatus("Connected to " + (github.owner || "") + "/" + (github.repository || "") + ". Read access verified; write access is checked when publishing.");
      }).catch(function (error) {
        githubToken = "";
        disconnect.hidden = true;
        form.elements.token.required = true;
        connectButton.disabled = false;
        connectButton.textContent = "Connect";
        setGitHubStatus("Could not connect: " + error.message);
      });
    });
    disconnect.addEventListener("click", function () {
      githubToken = "";
      disconnect.hidden = true;
      form.elements.token.required = true;
      connectButton.disabled = false;
      connectButton.textContent = "Connect";
      setAdminAccess(false);
      setGitHubStatus("Disconnected. Connect again to publish changes.");
    });
  }
  function compressImageFile(file) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      var objectUrl = URL.createObjectURL(file);
      function release() { URL.revokeObjectURL(objectUrl); }
      image.onload = function () {
        try {
          var scale = Math.min(1, 1200 / Math.max(image.width, image.height));
          var canvas = document.createElement("canvas");
          canvas.width = Math.round(image.width * scale);
          canvas.height = Math.round(image.height * scale);
          var context = canvas.getContext("2d");
          if (!context) throw new Error("Image processing is unavailable in this browser.");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          var imageData = canvas.toDataURL("image/jpeg", 0.84);
          release();
          resolve(imageData);
        } catch (error) {
          release();
          reject(error);
        }
      };
      image.onerror = function () {
        release();
        reject(new Error("The selected file could not be read as an image."));
      };
      image.src = objectUrl;
    });
  }
  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }
  function diamondOMarkup() {
    return '<span class="diamond-o" role="img" aria-label="O"><svg viewBox="0 0 20 24" aria-hidden="true"><path d="M4 2h12l4 6-10 14L0 8z" fill="#bd9d70"/><path d="M4 2 7 8h6l3-6M0 8h20M7 8l3 14 3-14" fill="none" stroke="#f8f6f2" stroke-width="1"/></svg></span>';
  }
  function brandTextMarkup(value) {
    return escapeHtml(value).replace(/\b(Bukola|Halima)\b/gi, function (word) {
      var uppercase = word === word.toUpperCase();
      var capitalized = word.charAt(0) === word.charAt(0).toUpperCase();
      return (uppercase ? "BUK" : capitalized ? "Buk" : "buk") + diamondOMarkup() + (uppercase ? "LA" : "la");
    });
  }
  function record(type, item, extra) {
    var events = read(keys.events, []);
    events.push({ type: type, item: item || "", page: document.body.dataset.page || "", at: new Date().toISOString(), extra: extra || "" });
    return write(keys.events, events.slice(-5000));
  }
  function whatsappUrl(message) {
    return "https://wa.me/" + (CFG.whatsapp || "") + "?text=" + encodeURIComponent(message);
  }
  function recordAccessoryOrder(item) {
    var account = currentAccount();
    var customer = account ? account.name + " (" + account.email + ")" : "Guest (not signed in)";
    if (!record("whatsapp_accessory_order_opened", item.name, customer)) {
      window.alert("We couldn’t record this WhatsApp order click in this browser. You can still continue to WhatsApp.");
    }
  }
  function accessoryOrderUrl(item) {
    var discountedPrice = salePrice(item);
    var currentPrice = discountedPrice === null ? Number(item.price || 0) : discountedPrice;
    var priceText = formatPrice(currentPrice) + (discountedPrice === null ? "" : " (was " + formatPrice(item.price) + ")");
    return whatsappUrl("Hello " + brand() + ", I’d like to order the " + item.name + " (" + priceText + ").");
  }
  function saveCustomer(details, source) {
    var customers = read(keys.customers, []);
    var email = (details.email || "").trim().toLowerCase();
    var phone = (details.phone || "").replace(/\s+/g, "");
    var found = customers.find(function (customer) {
      return (email && customer.email.toLowerCase() === email) || (phone && customer.phone.replace(/\s+/g, "") === phone);
    });
    if (found) {
      found.name = details.name.trim();
      if (email) found.email = email;
      if (phone) found.phone = details.phone.trim();
      found.updatedAt = new Date().toISOString();
      if (source && String(found.source || "").indexOf(source) === -1) found.source = found.source ? found.source + ", " + source : source;
      if (details.emailOptIn) found.emailOptInAt = new Date().toISOString();
    } else {
      found = {
        id: "c-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name: details.name.trim(),
        email: email,
        phone: details.phone.trim(),
        source: source || "Website",
        emailOptInAt: details.emailOptIn ? new Date().toISOString() : "",
        createdAt: new Date().toISOString()
      };
      customers.unshift(found);
    }
    if (!write(keys.customers, customers)) return null;
    return found;
  }
  function getAccounts() { return read(keys.accounts, []); }
  function currentAccount() {
    var email = sessionStorage.getItem("crystal_current_email") || "";
    return getAccounts().find(function (account) { return account.email === email; }) || null;
  }
  function currentInspiration() {
    var account = currentAccount();
    return account ? (Array.isArray(account.inspiration) ? account.inspiration : []) : [];
  }
  function allInspirations() {
    var saved = [];
    getAccounts().forEach(function (account) {
      if (Array.isArray(account.inspiration)) saved = saved.concat(account.inspiration);
    });
    return saved;
  }
  function useAccount(account) {
    account.inspiration = Array.isArray(account.inspiration) ? account.inspiration : [];
    if (!write(keys.accounts, getAccounts().map(function (entry) { return entry.email === account.email ? account : entry; }))) {
      return false;
    }
    sessionStorage.setItem("crystal_current_email", account.email);
    return true;
  }
  function passwordHash(password, salt) {
    var bytes = new TextEncoder().encode(password);
    var saltBytes = new TextEncoder().encode(salt);
    return window.crypto.subtle.importKey("raw", bytes, "PBKDF2", false, ["deriveBits"]).then(function (key) {
      return window.crypto.subtle.deriveBits({ name: "PBKDF2", salt: saltBytes, iterations: 120000, hash: "SHA-256" }, key, 256);
    }).then(function (digest) {
      return Array.prototype.map.call(new Uint8Array(digest), function (byte) {
        return byte.toString(16).padStart(2, "0");
      }).join("");
    });
  }
  function newPasswordSalt() {
    var bytes = window.crypto.getRandomValues(new Uint8Array(16));
    return Array.prototype.map.call(bytes, function (byte) {
      return byte.toString(16).padStart(2, "0");
    }).join("");
  }
  function brand() { return CFG.brand || "Bukola Crystal Atelier"; }
  function caption(item, field) {
    var captions = read(keys.captions, {});
    return captions[item.id] && captions[item.id][field] ? captions[item.id][field] : item[field];
  }

  function header() {
    var current = document.body.dataset.page || "";
    var links = [
      ["index.html", "Home", "home"], ["women.html", "Collection", "women"], ["accessories.html", "Accessories", "accessories"],
      ["design.html", "Custom design", "design"], ["story.html", "Our story", "story"], ["book.html", "Book a fitting", "book"],
      ["account.html", "My inspiration", "account"]
    ];
    var navLinks = links.map(function (link) {
      return '<a href="' + link[0] + '"' + (current === link[2] ? ' class="active"' : "") + ">" + link[1] + "</a>";
    }).join("");
    var logo = '<a class="brand" href="index.html" aria-label="' + escapeHtml(brand()) + ' home"><span class="brand-mark">✧</span><span class="brand-name">' + brandTextMarkup(brand().replace(/\s+Atelier$/i, "")) + '<small>Atelier · Lagos</small></span></a>';
    var host = $("#site-header");
    if (!host) return;
    host.innerHTML = '<div class="nav-wrap">' + logo + '<nav class="main-nav" aria-label="Main navigation">' + navLinks + '</nav><div class="nav-actions"><a class="nav-signup" href="signup.html">A note from us ✧</a><button class="nav-menu" type="button" aria-label="Open menu" aria-expanded="false">☰</button></div></div><nav class="mobile-nav" aria-label="Mobile navigation">' + navLinks + '<a href="signup.html">Sign up for atelier notes</a></nav>';
    var menu = $(".nav-menu", host);
    menu.addEventListener("click", function () {
      var panel = $(".mobile-nav", host);
      var open = panel.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.textContent = open ? "×" : "☰";
    });
  }
  function footer() {
    var host = $("#site-footer");
    if (!host) return;
    var instagram = CFG.instagram || "https://www.instagram.com/";
    host.innerHTML = '<div class="footer-main"><div class="footer-about"><a class="brand" href="index.html" aria-label="' + escapeHtml(brand()) + ' home"><span class="brand-mark">✧</span><span class="brand-name">' + brandTextMarkup(brand().replace(/\s+Atelier$/i, "")) + '<small>Atelier · Lagos</small></span></a><p>One-of-one occasionwear and thoughtful finishing touches, made with feeling.</p></div><div class="footer-column"><b>Find your way</b><a href="women.html">Collection</a><a href="accessories.html">Accessories</a><a href="design.html">Custom design</a><a href="account.html">My inspiration</a></div><div class="footer-column"><b>Let’s talk</b><a href="book.html">Book a fitting</a><a href="mailto:' + escapeHtml(CFG.email || "hello@example.com") + '">Email the atelier</a><a href="' + escapeHtml(instagram) + '" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div><div class="footer-column"><b>Come say hello</b><span>' + escapeHtml(CFG.studio || "Lagos, Nigeria") + '</span><span>' + escapeHtml(CFG.hours || "Monday–Saturday, 10am–6pm") + '</span><a href="https://wa.me/' + escapeHtml(CFG.whatsapp || "") + '" target="_blank" rel="noopener noreferrer">WhatsApp us ↗</a></div></div><div class="footer-bottom"><span>© ' + new Date().getFullYear() + " " + brandTextMarkup(brand()) + '</span><span>Made with care, and a little sparkle. <a href="admin.html">Studio</a></span></div>';
  }

  function accessoryArtwork(item) {
    return '<div class="accessory-artwork art-' + item.type + '"><span class="art-halo"></span><span class="art-object"></span><span class="art-stone"></span><span class="art-copy">' + escapeHtml(item.category) + '</span></div>';
  }
  function hasProductPrice(item) {
    return item.price !== null && item.price !== undefined && String(item.price).trim() !== ""
      && Number.isFinite(Number(item.price)) && Number(item.price) >= 0;
  }
  function salePrice(item) {
    if (!hasProductPrice(item) || item.salePrice === null || item.salePrice === undefined || String(item.salePrice).trim() === "") return null;
    var regularPrice = Number(item.price);
    var discountedPrice = Number(item.salePrice);
    return regularPrice > 0 && Number.isFinite(discountedPrice) && discountedPrice >= 0 && discountedPrice < regularPrice
      ? discountedPrice
      : null;
  }
  function formatPrice(value) {
    return "₦" + Number(value).toLocaleString("en-NG");
  }
  function productPriceMarkup(item) {
    var discountedPrice = salePrice(item);
    if (discountedPrice !== null) {
      return '<span class="product-sale-price">' + formatPrice(discountedPrice) + '</span> <del class="product-former-price">' + formatPrice(item.price) + '</del>';
    }
    return hasProductPrice(item) ? formatPrice(item.price) : '<span class="price-on-request">Price on request</span>';
  }
  function productSizes(item) {
    var values = Array.isArray(item.sizes) ? item.sizes : String(item.sizes || "").split(",");
    return values.map(function (size) { return String(size).trim(); }).filter(Boolean);
  }
  function productStockLabel(item) {
    if (item.quantity === null || item.quantity === undefined || String(item.quantity).trim() === "") return "";
    var quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 0) return "";
    return quantity === 0 ? "Out of stock" : quantity + " in stock";
  }
  function productDetailsMarkup(item, isAccessory) {
    var details = '<p class="work-for product-price">' + productPriceMarkup(item) + (isAccessory ? ' <b>· Made with care</b>' : "") + '</p>';
    if (!isAccessory && item.recipient) details += '<p class="work-for"><b>Made for:</b> ' + escapeHtml(caption(item, "recipient")) + '</p>';
    var sizes = productSizes(item);
    if (sizes.length) details += '<p class="work-for product-spec"><b>Sizes:</b> ' + escapeHtml(sizes.join(", ")) + '</p>';
    var stock = productStockLabel(item);
    if (stock) details += '<p class="work-for product-spec"><b>Availability:</b> ' + escapeHtml(stock) + '</p>';
    return details;
  }
  function card(item, isAccessory, badge) {
    var saved = currentInspiration();
    var isSaved = saved.indexOf(item.id) !== -1;
    var picture = isAccessory && !item.image ? accessoryArtwork(item) : '<img src="' + escapeHtml(item.image || "") + '" alt="' + escapeHtml(item.name + (isAccessory ? " accessory" : " custom occasionwear")) + '" loading="lazy">';
    var sale = salePrice(item) !== null;
    var promo = item.isNew ? (sale ? "NEW · ON SALE" : "NEW") : (sale ? "ON SALE" : "");
    return '<article class="work-card" data-item="' + escapeHtml(item.id) + '" data-accessory="' + (isAccessory ? "true" : "false") + '" tabindex="0" aria-label="View ' + escapeHtml(item.name) + '"><div class="work-image">' + picture + (badge ? '<span class="work-badge">' + escapeHtml(badge) + '</span>' : "") + (promo ? '<span class="work-badge work-badge-promo">' + promo + '</span>' : "") + '<button class="save-inspiration' + (isSaved ? " saved" : "") + '" type="button" data-save="' + escapeHtml(item.id) + '" aria-label="' + (isSaved ? "Remove from" : "Add to") + ' inspiration" aria-pressed="' + isSaved + '">' + (isSaved ? "♥" : "♡") + '</button></div><div class="work-meta"><div class="work-title-row"><h3 class="work-title">' + escapeHtml(item.name) + '</h3><span class="work-category">' + escapeHtml(item.category) + '</span></div><p class="work-tagline">“' + escapeHtml(caption(item, "tagline")) + '”</p>' + productDetailsMarkup(item, isAccessory) + '<span class="view-design">' + (isAccessory ? "View & order" : "View this story") + ' ↗</span></div></article>';
  }
  function renderCollection() {
    var featured = $('[data-collection="featured"]');
    if (featured) featured.innerHTML = works.map(function (item) { return card(item, false, "CUSTOM LOOK"); }).join("");
    var homeDesigns = $('[data-collection="home-designs"]');
    if (homeDesigns) homeDesigns.innerHTML = works.map(function (item) { return card(item, false, "MADE TO MEASURE"); }).join("");
    setupFeaturedCarousel();
    var featuredAccessories = $('[data-collection="featured-accessories"]');
    if (featuredAccessories) featuredAccessories.innerHTML = accessories.map(function (item) { return card(item, true, "HAND FINISHED"); }).join("");
    setupAccessoryCarousel();
    var designGrid = $('[data-collection="designs"]');
    if (designGrid) {
      designGrid.innerHTML = works.map(function (item) { return card(item, false, "MADE TO MEASURE"); }).join("");
      $("#design-count").textContent = works.length + " atelier stories";
      setupFilters("#design-filters", ["All", "Evening", "Celebration", "Occasion"], "designs");
    }
    var accessoryGrid = $('[data-collection="accessories"]');
    if (accessoryGrid) {
      accessoryGrid.innerHTML = accessories.map(function (item) { return card(item, true, "HAND FINISHED"); }).join("");
      $("#accessory-count").textContent = accessories.length + " little treasures";
      setupFilters("#accessory-filters", ["All", "Bags", "Hair", "Jewellery"], "accessories");
    }
    $$(".work-card").forEach(function (element) {
      element.addEventListener("click", function (event) {
        if (event.target.closest("[data-save], [data-accessory-order]")) return;
        var id = element.dataset.item;
        var isAccessory = element.dataset.accessory === "true";
        openItem(id, isAccessory);
      });
      element.addEventListener("keydown", function (event) {
        if ((event.key === "Enter" || event.key === " ") && !event.target.closest("[data-save], [data-accessory-order]")) {
          event.preventDefault();
          openItem(element.dataset.item, element.dataset.accessory === "true");
        }
      });
    });
    $$("[data-save]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleInspiration(button.dataset.save);
      });
    });
  }
  function setupAccessoryCarousel() {
    setupHorizontalCarousel(".accessory-carousel", '[data-collection="featured-accessories"]', ".accessory-scroll");
  }
  function setupFeaturedCarousel() {
    setupHorizontalCarousel(".featured-carousel", '[data-collection="featured"]', ".featured-scroll");
  }
  function setupHorizontalCarousel(carouselSelector, trackSelector, buttonSelector) {
    var carousel = $(carouselSelector);
    var track = $(trackSelector, carousel || document);
    if (!carousel || !track) return;
    $$(buttonSelector, carousel).forEach(function (button) {
      button.addEventListener("click", function () {
        track.scrollBy({
          left: (button.dataset.direction === "left" ? -1 : 1) * track.clientWidth * 0.8,
          behavior: "smooth"
        });
      });
    });
  }
  function setupFilters(selector, categories, target) {
    var host = $(selector);
    if (!host) return;
    host.innerHTML = categories.map(function (category, index) {
      return '<button class="filter-chip' + (index === 0 ? " active" : "") + '" type="button" data-filter="' + escapeHtml(category) + '">' + escapeHtml(category) + '</button>';
    }).join("");
    host.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) return;
      $$(".filter-chip", host).forEach(function (chip) { chip.classList.toggle("active", chip === button); });
      var list = target === "designs" ? works : accessories;
      var shown = list.filter(function (item) { return button.dataset.filter === "All" || item.category === button.dataset.filter; });
      var grid = $('[data-collection="' + target + '"]');
      grid.innerHTML = shown.map(function (item) {
        return card(item, target === "accessories", target === "accessories" ? "HAND FINISHED" : "MADE TO MEASURE");
      }).join("");
      if (target === "designs") $("#design-count").textContent = shown.length + (shown.length === 1 ? " atelier story" : " atelier stories");
      else $("#accessory-count").textContent = shown.length + (shown.length === 1 ? " little treasure" : " little treasures");
      renderCollectionEvents();
    });
  }
  function renderCollectionEvents() {
    $$(".work-card").forEach(function (element) {
      element.addEventListener("click", function (event) {
        if (!event.target.closest("[data-save], [data-accessory-order]")) openItem(element.dataset.item, element.dataset.accessory === "true");
      });
      element.addEventListener("keydown", function (event) {
        if ((event.key === "Enter" || event.key === " ") && !event.target.closest("[data-save], [data-accessory-order]")) {
          event.preventDefault();
          openItem(element.dataset.item, element.dataset.accessory === "true");
        }
      });
    });
    $$("[data-save]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleInspiration(button.dataset.save);
      });
    });
    $$("[data-accessory-order]").forEach(function (link) {
      link.addEventListener("click", function () {
        var item = accessories.find(function (entry) { return entry.id === link.dataset.accessoryOrder; });
        if (item) recordAccessoryOrder(item);
      });
    });
  }
  function showInspirationAuthPrompt() {
    var root = $("#modal-root") || document.body;
    if ($("#inspiration-auth-prompt", root)) return;
    root.insertAdjacentHTML("beforeend", '<div class="auth-prompt" id="inspiration-auth-prompt"><section class="auth-prompt-card" role="dialog" aria-modal="true" aria-labelledby="inspiration-auth-title"><button class="auth-prompt-close" type="button" aria-label="Close">×</button><span class="auth-prompt-gem">✧</span><p class="eyebrow">A LITTLE STEP BEFORE WE BEGIN</p><h2 id="inspiration-auth-title">Sign in to save this look.</h2><p>Sign in or create an atelier account to add looks to your inspiration.</p><div class="auth-prompt-actions"><a class="button" href="account.html#login-form">Sign in <span>↗</span></a><a class="text-link" href="account.html#create-account-form">Create an account <span>↗</span></a></div></section></div>');
    var prompt = $("#inspiration-auth-prompt", root);
    function close() {
      prompt.remove();
      if (!$("#modal-root .modal-backdrop")) document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", handleKeydown);
    }
    function handleKeydown(event) { if (event.key === "Escape") close(); }
    $(".auth-prompt-close", prompt).addEventListener("click", close);
    prompt.addEventListener("click", function (event) { if (event.target === prompt) close(); });
    document.addEventListener("keydown", handleKeydown);
    document.body.classList.add("modal-open");
    $(".auth-prompt-close", prompt).focus();
  }
  function toggleInspiration(id) {
    var account = currentAccount();
    if (!account) {
      showInspirationAuthPrompt();
      return;
    }
    var list = currentInspiration();
    var added = list.indexOf(id) === -1;
    if (added) list.push(id);
    else list = list.filter(function (value) { return value !== id; });
    var saved = write(keys.accounts, getAccounts().map(function (entry) {
      if (entry.email === account.email) entry.inspiration = list;
      return entry;
    }));
    if (!saved) { window.alert("We couldn’t save this inspiration in your browser. Please check your storage and try again."); return; }
    record(added ? "inspiration_saved" : "inspiration_removed", itemName(id));
    $$('[data-save="' + id + '"]').forEach(function (button) {
      button.classList.toggle("saved", added);
      button.setAttribute("aria-pressed", String(added));
      button.setAttribute("aria-label", (added ? "Remove from" : "Add to") + " inspiration");
      button.textContent = added ? "♥" : "♡";
    });
    var modalSave = $("#modal-save");
    if (modalSave && modalSave.dataset.item === id) {
      modalSave.textContent = added ? "♥ Saved to your inspiration" : "♡ Add to your inspiration";
      modalSave.setAttribute("aria-pressed", String(added));
    }
    if (document.body.dataset.page === "account") renderAccount();
  }
  function itemName(id) {
    var found = works.concat(accessories).find(function (item) { return item.id === id; });
    return found ? found.name : id;
  }
  function itemImages(item) {
    var images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
    if (item.image && images.indexOf(item.image) === -1) images.unshift(item.image);
    return images;
  }
  function accessoryPairings(item) {
    if (item.relatedAccessories && item.relatedAccessories.length) {
      return item.relatedAccessories.map(function (id) {
        return accessories.find(function (entry) { return entry.id === id; });
      }).filter(Boolean);
    }
    return accessories.filter(function (entry) { return entry.id !== item.id; }).slice(0, 3);
  }
  function openItem(id, isAccessory) {
    var item = (isAccessory ? accessories : works).find(function (entry) { return entry.id === id; });
    if (!item) return;
    record(isAccessory ? "accessory_view" : "design_view", item.name);
    var root = $("#modal-root");
    var isSaved = currentInspiration().indexOf(id) !== -1;
    var images = itemImages(item);
    var mainImage = isAccessory && !item.image && !images.length
      ? accessoryArtwork(item)
      : '<img id="modal-main-image" src="' + escapeHtml(images[0] || "") + '" alt="' + escapeHtml(item.name) + '">';
    var thumbnails = images.length > 1
      ? '<div class="modal-thumbnails" aria-label="More pictures of ' + escapeHtml(item.name) + '">' + images.map(function (src, index) {
        return '<button class="modal-thumb' + (index === 0 ? " active" : "") + '" type="button" data-gallery-src="' + escapeHtml(src) + '" aria-label="Show picture ' + (index + 1) + '"><img src="' + escapeHtml(src) + '" alt=""></button>';
      }).join("") + "</div>"
      : "";
    var itemAction = isAccessory ? "I’d love to order the " + item.name + " (₦" + item.price.toLocaleString("en-NG") + ")." : "I’d love to create a custom look inspired by " + item.name + ".";
    var action = isAccessory ? "Ask about this piece" : "Make a look like this";
    var recommendations = isAccessory ? [] : accessoryPairings(item);
    root.innerHTML = '<div class="modal-backdrop" role="presentation"><section class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" type="button" aria-label="Close">×</button><div class="modal-gallery"><div class="modal-image">' + mainImage + '</div>' + thumbnails + '</div><div class="modal-copy"><p class="eyebrow">' + escapeHtml(item.category) + (isAccessory ? " · HAND FINISHED" : " · A CUSTOM LOOK") + '</p><h2 class="work-title" id="modal-title">' + escapeHtml(item.name) + '</h2><p class="work-tagline">“' + escapeHtml(caption(item, "tagline")) + '”</p>' + (isAccessory ? '<p>₦' + Number(item.price || 0).toLocaleString("en-NG") + '</p>' : '<p class="work-for"><b>Made for:</b> ' + escapeHtml(caption(item, "recipient")) + '</p>') + '<p>' + escapeHtml(item.description || "A thoughtful finishing touch, made to bring your look together.") + '</p><a class="button" href="' + (isAccessory ? whatsappUrl("Hello " + brand() + ", " + itemAction) : "design.html?inspiration=" + encodeURIComponent(item.name)) + '" ' + (isAccessory ? 'target="_blank" rel="noopener noreferrer"' : "") + '>' + action + ' <span>↗</span></a><button class="modal-save" id="modal-save" data-item="' + escapeHtml(id) + '" aria-pressed="' + isSaved + '">' + (isSaved ? "♥ Saved to your inspiration" : "♡ Add to your inspiration") + '</button></div>' + (recommendations.length ? '<section class="modal-related"><div class="section-heading"><div><p class="eyebrow">A LOVELY PAIRING</p><h3>Accessories to complete the look.</h3></div><a class="text-link" href="accessories.html">See all <span>↗</span></a></div><div class="work-grid related-grid">' + recommendations.map(function (entry) { return card(entry, true, "GOES WITH YOUR LOOK"); }).join("") + '</div></section>' : "") + '</section></div>';
    var modalPriceDetails = $$(".modal-copy > p", root)[2];
    if (modalPriceDetails) {
      var productDetails = document.createElement("div");
      productDetails.className = "product-detail-meta";
      productDetails.innerHTML = productDetailsMarkup(item, isAccessory);
      modalPriceDetails.replaceWith(productDetails);
    }
    var modalStatus = $(".modal-copy .eyebrow", root);
    var onSale = salePrice(item) !== null;
    if (modalStatus && (item.isNew || onSale)) {
      var status = document.createElement("span");
      status.className = "product-promo-status";
      status.textContent = item.isNew ? (onSale ? "New · On sale" : "New") : "On sale";
      modalStatus.insertAdjacentElement("afterend", status);
    }
    var relatedGrid = $(".related-grid", root);
    if (relatedGrid) {
      relatedGrid.tabIndex = 0;
      relatedGrid.setAttribute("aria-label", "Related accessories. Swipe or scroll horizontally to explore.");
    }
    var backdrop = $(".modal-backdrop", root);
    $(".modal-close", root).addEventListener("click", closeModal);
    backdrop.addEventListener("click", function (event) { if (event.target === backdrop) closeModal(); });
    if (isAccessory) {
      var orderLink = $(".modal-copy > a.button", root);
      orderLink.href = accessoryOrderUrl(item);
      orderLink.dataset.accessoryOrder = item.id;
      orderLink.addEventListener("click", function () { recordAccessoryOrder(item); });
    }
    $("#modal-save", root).addEventListener("click", function () { toggleInspiration(id); });
    $$("[data-gallery-src]", root).forEach(function (button) {
      button.addEventListener("click", function () {
        $("#modal-main-image", root).src = button.dataset.gallerySrc;
        $$(".modal-thumb", root).forEach(function (thumb) { thumb.classList.toggle("active", thumb === button); });
      });
    });
    $$(".modal-related .work-card", root).forEach(function (element) {
      element.addEventListener("click", function (event) {
        if (event.target.closest("[data-save]")) return;
        closeModal();
        openItem(element.dataset.item, true);
      });
      element.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          closeModal();
          openItem(element.dataset.item, true);
        }
      });
    });
    $$("[data-save]", root).forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        toggleInspiration(button.dataset.save);
      });
    });
    document.addEventListener("keydown", escapeModal);
    document.body.classList.add("modal-open");
    $(".modal-close", root).focus();
  }
  function escapeModal(event) { if (event.key === "Escape") closeModal(); }
  function closeModal() {
    var root = $("#modal-root");
    if (root) root.innerHTML = "";
    document.body.classList.remove("modal-open");
    document.removeEventListener("keydown", escapeModal);
  }
  function protectRequestForm(form) {
    if (!form) return false;
    var gate = form.parentNode.querySelector("[data-auth-gate]");
    var account = currentAccount();
    if (account) {
      if (gate) gate.remove();
      form.hidden = false;
      ["name", "phone", "email"].forEach(function (field) {
        if (form.elements[field] && account[field]) form.elements[field].value = account[field];
      });
      return true;
    }
    form.hidden = true;
    if (!gate) {
      var destination = location.pathname.split("/").pop() + location.search;
      gate = document.createElement("section");
      gate.className = "auth-gate";
      gate.setAttribute("data-auth-gate", "");
      gate.innerHTML = '<p class="eyebrow">A LITTLE STEP BEFORE WE BEGIN</p><h2>Sign in to continue.</h2><p>Create an account or sign in to request a fitting or send us a custom design idea.</p><a class="button" href="account.html?return=' + encodeURIComponent(destination) + '">Sign in or create an account <span>↗</span></a>';
      form.parentNode.insertBefore(gate, form);
    }
    return false;
  }
  function setupForms() {
    var today = new Date();
    var dateInput = $('#booking-form input[name="date"]');
    if (dateInput) dateInput.min = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");

    var bookingForm = $("#booking-form");
    if (bookingForm) {
      protectRequestForm(bookingForm);
      bookingForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!protectRequestForm(bookingForm)) return;
      var form = new FormData(bookingForm);
      var account = currentAccount();
      var details = { name: String(form.get("name") || "").trim(), phone: String(form.get("phone") || "").trim(), email: account.email };
      var day = String(form.get("date") || "");
      var selected = new Date(day + "T00:00:00");
      var message = $(".form-message", bookingForm);
      if (!details.name || !details.phone || !day) { message.textContent = "Please add your name, phone number and a preferred date."; return; }
      if (selected < new Date(today.getFullYear(), today.getMonth(), today.getDate())) { message.textContent = "Please choose a date from today onwards."; return; }
      if (selected.getDay() === 0) { message.textContent = "We’re closed on Sundays. Please choose another day."; return; }
      var customer = saveCustomer(details, "Fitting request");
      if (!customer) { message.textContent = "We couldn’t save your details on this device. Please check your browser storage and try again."; return; }
      var booking = {
        id: "b-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        customerId: customer.id, name: details.name, phone: details.phone, email: details.email,
        service: String(form.get("service") || ""), date: day, time: String(form.get("time") || ""),
        notes: String(form.get("notes") || "").trim(), status: "Requested", createdAt: new Date().toISOString()
      };
      var bookings = read(keys.bookings, []);
      bookings.unshift(booking);
      if (!write(keys.bookings, bookings)) { message.textContent = "We couldn’t save the fitting request on this device. Please try again."; return; }
      record("fitting_request", booking.service, booking.name);
      var prettyDate = selected.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
      var text = "Hello " + brand() + ", I’d like to request a fitting.\nName: " + details.name + "\nPhone: " + details.phone + (details.email ? "\nEmail: " + details.email : "") + "\nService: " + booking.service + "\nPreferred date: " + prettyDate + "\nTime: " + booking.time + (booking.notes ? "\nNotes: " + booking.notes : "");
      message.textContent = "Your request is saved for the atelier. WhatsApp will open so we can confirm your appointment.";
      record("whatsapp_fitting_opened", booking.service);
      window.open(whatsappUrl(text), "_blank", "noopener");
      bookingForm.reset();
      ["name", "phone", "email"].forEach(function (field) {
        if (bookingForm.elements[field] && account[field]) bookingForm.elements[field].value = account[field];
      });
      dateInput.min = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
      });
    }

    var signupForm = $("#signup-form");
    if (signupForm) signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var form = new FormData(signupForm);
      var details = { name: String(form.get("name") || "").trim(), email: String(form.get("email") || "").trim(), phone: String(form.get("phone") || "").trim(), emailOptIn: form.get("consent") === "on" };
      if (!saveCustomer(details, "Atelier notes")) { $(".form-message", signupForm).textContent = "We couldn’t save your details on this device. Please try again."; return; }
      record("signup", "", details.email);
      $(".form-message", signupForm).textContent = "You’re on the list. We’ll keep a little sparkle aside for you.";
      signupForm.reset();
    });

    var customForm = $("#custom-form");
    if (customForm) {
      protectRequestForm(customForm);
      var inspiredBy = new URLSearchParams(location.search).get("inspiration");
      var reference = works.find(function (item) { return item.name === inspiredBy; });
      if (reference) {
        customForm.elements.recipient.value = caption(reference, "recipient");
        customForm.elements.idea.value = "I’m inspired by " + reference.name + " and would love to create a look that feels like my own.";
      }
      customForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!protectRequestForm(customForm)) return;
        var form = new FormData(customForm);
        var name = String(form.get("name") || "").trim();
        var phone = String(form.get("phone") || "").trim();
        var account = currentAccount();
        var email = account.email;
        var customer = saveCustomer({ name: name, phone: phone, email: email }, "Custom design inquiry");
        if (!customer) { $(".form-message", customForm).textContent = "We couldn’t save your details on this device. Please try again."; return; }
        var file = form.get("reference");
        var text = "Hello " + brand() + ", I have an idea for a custom design.\nName: " + name + "\nPhone: " + phone + (email ? "\nEmail: " + email : "") + "\nWho it’s for: " + String(form.get("recipient") || "") + "\nPiece: " + String(form.get("piece") || "") + "\nOccasion: " + String(form.get("occasion") || "") + "\nMy idea: " + String(form.get("idea") || "") + (file && file.name ? "\nI’ll attach my reference picture here: " + file.name : "");
        record("custom_design_inquiry", String(form.get("piece") || ""), name);
        $(".form-message", customForm).textContent = "Your idea is ready. WhatsApp will open so we can dream it up together.";
        window.open(whatsappUrl(text), "_blank", "noopener");
      });
    }
  }
  function setupSignupPopup() {
    var page = document.body.dataset.page;
    if (page !== "home") return;
    var root = $("#modal-root");
    var seenKey = "crystal_signup_seen_v2";
    if (!root || sessionStorage.getItem(seenKey)) return;
    var markup = '<div class="signup-pop" id="signup-pop" hidden><section class="signup-pop-card" role="dialog" aria-modal="true" aria-labelledby="pop-title"><button class="pop-close" aria-label="Close" type="button">×</button><span class="pop-gem">✧</span><p class="eyebrow">A LITTLE NOTE FROM US</p><h2 id="pop-title">Save a little room<br><em>for sparkle.</em></h2><p>Sign up for new designs, lovely studio moments and first peeks at our next creations.</p><a class="button" href="signup.html">Sign up for atelier notes <span>↗</span></a></section></div>';
    root.insertAdjacentHTML("beforeend", markup);
    var modal = $("#signup-pop", root);
    var close = function () { modal.hidden = true; document.body.classList.remove("modal-open"); };
    $(".pop-close", modal).addEventListener("click", close);
    modal.addEventListener("click", function (event) { if (event.target === modal) close(); });
    window.setTimeout(function () {
      if (!$("#modal-root .modal-backdrop")) {
        modal.hidden = false;
        document.body.classList.add("modal-open");
        sessionStorage.setItem(seenKey, "1");
      }
    }, 5000);
  }

  function getStoryContent() {
    var stored = read(keys.story, {}) || {};
    function merge(defaults, values) {
      var source = values && typeof values === "object" ? values : {};
      var result = {};
      Object.keys(defaults).forEach(function (key) {
        result[key] = typeof source[key] === "string" ? source[key] : defaults[key];
      });
      return result;
    }
    return {
      copy: merge(storyDefaults.copy, stored.copy),
      images: merge(storyDefaults.images, stored.images),
      alts: merge(storyDefaults.alts, stored.alts)
    };
  }
  function validStoryImageSource(source) {
    return !/^(javascript|file|http):/i.test(source)
      && (!/^data:/i.test(source) || /^data:image\/jpeg;base64,/i.test(source));
  }
  function applyStoryContent() {
    if (document.body.dataset.page !== "story") return;
    var content = getStoryContent();
    $$("[data-story-copy]").forEach(function (element) {
      element.innerHTML = brandTextMarkup(content.copy[element.dataset.storyCopy]);
    });
    $$("[data-story-image]").forEach(function (element) {
      var key = element.dataset.storyImage;
      var source = content.images[key];
      if (!source) element.removeAttribute("src");
      else element.src = validStoryImageSource(source) ? source : storyDefaults.images[key];
      element.alt = content.alts[element.dataset.storyAlt] || "";
    });
  }
  function setupStoryMotion() {
    if (document.body.dataset.page !== "story") return;
    var revealElements = [];
    $$(".story-chapter").forEach(function (section) {
      var reverse = section.classList.contains("story-chapter-reverse");
      var image = $(".story-image", section);
      var copy = $(".story-copy", section);
      if (image) {
        image.classList.add("story-reveal", reverse ? "story-reveal-right" : "story-reveal-left");
        revealElements.push(image);
      }
      if (copy) {
        copy.classList.add("story-reveal", reverse ? "story-reveal-left" : "story-reveal-right");
        revealElements.push(copy);
      }
    });
    [
      ".story-hero > .eyebrow",
      ".story-hero > p:not(.eyebrow)",
      ".values-band > div",
      ".story-journey > .eyebrow",
      ".story-journey > h2",
      ".story-timeline > div",
      ".story-bottom-cta > .eyebrow",
      ".story-bottom-cta > h2",
      ".story-bottom-cta > p:not(.eyebrow)",
      ".story-bottom-cta .story-cta-actions"
    ].forEach(function (selector) {
      $$(selector).forEach(function (element) {
        element.classList.add("story-reveal");
        revealElements.push(element);
      });
    });
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach(function (element) { element.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    revealElements.forEach(function (element) { observer.observe(element); });
  }

  function accountReturnTarget() {
    var target = new URLSearchParams(location.search).get("return");
    if (!target) return "";
    var destination = new URL(target, location.href);
    var filename = destination.pathname.split("/").pop();
    return destination.origin === location.origin && (filename === "book.html" || filename === "design.html")
      ? destination.href
      : "";
  }
  function finishAccountAccess(account) {
    if (!useAccount(account)) return false;
    record("account_login", "", account.email);
    var destination = accountReturnTarget();
    if (destination) location.assign(destination);
    else renderAccount();
    return true;
  }
  function renderAccount() {
    var root = $("#account-root");
    if (!root) return;
    var account = currentAccount();
    if (account) {
      var savedIds = currentInspiration();
      var savedItems = works.concat(accessories).filter(function (item) { return savedIds.indexOf(item.id) !== -1; });
      root.innerHTML = '<section class="account-dashboard"><div class="account-heading"><div><p class="eyebrow">YOUR ATELIER ACCOUNT</p><h1>Welcome, <em>' + escapeHtml(account.name.split(" ")[0]) + '.</em></h1><p>Your saved designs and finishing touches live here.</p></div><button class="admin-btn" id="account-signout" type="button">Sign out</button></div><div class="account-shortcuts"><a class="button" href="book.html">Book a fitting <span>↗</span></a><a class="text-link" href="design.html">Start a custom design <span>↗</span></a></div><section class="account-saved"><div class="section-heading"><div><p class="eyebrow">YOUR LITTLE COLLECTION</p><h2>Saved inspiration</h2></div><span class="collection-count">' + savedItems.length + (savedItems.length === 1 ? " saved piece" : " saved pieces") + '</span></div>' + (savedItems.length ? '<div class="work-grid">' + savedItems.map(function (item) { return card(item, accessories.indexOf(item) !== -1, "SAVED FOR YOU"); }).join("") + '</div>' : '<p class="empty-state">You haven’t saved anything yet. Tap the heart on a design or accessory to keep it here.</p>') + '</section></section>';
      $$(".work-card", root).forEach(function (element) {
        var item = accessories.find(function (entry) { return entry.id === element.dataset.item; });
        if (!item) return;
        var orderLink = document.createElement("a");
        orderLink.className = "button saved-accessory-order";
        orderLink.href = accessoryOrderUrl(item);
        orderLink.target = "_blank";
        orderLink.rel = "noopener noreferrer";
        orderLink.dataset.accessoryOrder = item.id;
        orderLink.innerHTML = 'Order on WhatsApp <span>↗</span>';
        element.appendChild(orderLink);
      });
      $("#account-signout", root).addEventListener("click", function () {
        sessionStorage.removeItem("crystal_current_email");
        renderAccount();
      });
      renderCollectionEvents();
      return;
    }
    root.innerHTML = '<section class="account-auth"><div class="account-intro"><p class="eyebrow">YOUR PERSONAL ATELIER SPACE</p><h1>Keep the pieces<br><em>that feel like you.</em></h1><p>Sign in to find your saved inspiration, request a fitting, or share a custom design idea.</p><span>✧</span></div><div class="account-forms"><form class="paper-form" id="create-account-form"><p class="eyebrow">NEW TO THE ATELIER?</p><h2>Create your account</h2><label>Your name<input name="name" autocomplete="name" required></label><label>Phone or WhatsApp <span>(optional)</span><input name="phone" type="tel" autocomplete="tel"></label><label>Email address<input name="email" type="email" autocomplete="email" required></label><label>Password <span>(at least 8 characters)</span><input name="password" type="password" autocomplete="new-password" minlength="8" required></label><button class="button" type="submit">Create account <span>↗</span></button><p class="form-message" aria-live="polite"></p></form><form class="paper-form" id="login-form"><p class="eyebrow">WELCOME BACK</p><h2>Sign in</h2><label>Email address<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button class="button" type="submit">Sign in <span>↗</span></button><p class="form-message" aria-live="polite"></p></form><p class="account-local-note">Preview accounts are stored only in this browser. This static demo is not secure for real customer accounts; connect a secure backend before publishing.</p></div></section>';
    var createForm = $("#create-account-form", root);
    createForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var message = $(".form-message", createForm);
      if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) {
        message.textContent = "Secure account sign-in is unavailable in this browser preview.";
        return;
      }
      var data = new FormData(createForm);
      var email = String(data.get("email") || "").trim().toLowerCase();
      var accounts = getAccounts();
      if (accounts.some(function (entry) { return entry.email === email; })) {
        message.textContent = "An account already uses this email. Please sign in instead.";
        return;
      }
      var salt = newPasswordSalt();
      passwordHash(String(data.get("password") || ""), salt).then(function (hash) {
        var account = {
          id: "a-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
          name: String(data.get("name") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          email: email,
          passwordSalt: salt,
          passwordHash: hash,
          inspiration: [],
          createdAt: new Date().toISOString()
        };
        accounts.unshift(account);
        if (!write(keys.accounts, accounts)) { message.textContent = "We couldn’t create an account in this browser. Check storage and try again."; return; }
        if (!saveCustomer(account, "Account sign-up")) {
          write(keys.accounts, accounts.filter(function (entry) { return entry.email !== email; }));
          message.textContent = "We couldn’t save your account details. Please try again.";
          return;
        }
        record("account_signup", "", email);
        if (!finishAccountAccess(account)) message.textContent = "We couldn’t start your account session. Please try again.";
      }).catch(function () {
        message.textContent = "We couldn’t create your account in this browser. Please try again.";
      });
    });
    var loginForm = $("#login-form", root);
    [createForm, loginForm].forEach(function (form) {
      $(".form-message", form).insertAdjacentHTML("beforebegin", '<div class="google-auth-divider"><span>or</span></div><button class="google-auth-button" type="button" data-google-auth><span class="google-auth-mark" aria-hidden="true">G</span>Continue with Google</button>');
      $(".google-auth-button", form).addEventListener("click", function () {
        $(".form-message", form).textContent = "Google sign-in will be connected when secure account services are set up.";
      });
    });
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var message = $(".form-message", loginForm);
      if (!window.crypto || !window.crypto.subtle || !window.TextEncoder) {
        message.textContent = "Secure account sign-in is unavailable in this browser preview.";
        return;
      }
      var data = new FormData(loginForm);
      var email = String(data.get("email") || "").trim().toLowerCase();
      var account = getAccounts().find(function (entry) { return entry.email === email; });
      if (!account) { message.textContent = "We couldn’t find an account with that email."; return; }
      passwordHash(String(data.get("password") || ""), account.passwordSalt).then(function (hash) {
        if (hash !== account.passwordHash) { message.textContent = "That password doesn’t match this account."; return; }
        if (!finishAccountAccess(account)) message.textContent = "We couldn’t start your account session. Please try again.";
      }).catch(function () {
        message.textContent = "We couldn’t sign you in from this browser. Please try again.";
      });
    });
  }

  function formatDate(value) {
    var date = new Date(value);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function admin() {
    var root = $("#admin-root");
    if (!root) return;
  
    root.innerHTML = '<div class="admin-head"><div><p class="eyebrow">ATELIER NOTES · LOCAL PREVIEW</p><h1>Your studio, at a glance.</h1><p>Bookings and interest recorded on this browser.</p></div><div class="admin-tools"><button class="admin-btn" id="admin-export">Export bookings CSV</button><button class="admin-btn" id="admin-clear">Clear preview data</button></div></div><div class="admin-note"><b>Preview mode:</b> data is saved in this browser’s local storage and is not shared with other visitors or devices. To collect live customer data across devices, connect a secure backend before publishing.</div><nav class="admin-tabs" aria-label="Dashboard sections"><button class="admin-tab active" data-tab="overview">Overview</button><button class="admin-tab" data-tab="bookings">Fitting requests</button><button class="admin-tab" data-tab="customers">Registered customers</button><button class="admin-tab" data-tab="interest">Most viewed & saved</button><button class="admin-tab" data-tab="captions">Design captions</button><button class="admin-tab" data-tab="story">Our story</button></nav><section class="admin-section" id="admin-overview"></section><section class="admin-section" id="admin-bookings" hidden></section><section class="admin-section" id="admin-customers" hidden></section><section class="admin-section" id="admin-interest" hidden></section><section class="admin-section" id="admin-captions" hidden></section><section class="admin-section" id="admin-story" hidden></section>';
    root.innerHTML = root.innerHTML
      .replace("ATELIER NOTES · LOCAL PREVIEW", "STUDIO ADMIN · GITHUB PAGES")
      .replace("Bookings and interest recorded on this browser.", "Storefront edits publish to GitHub; visitor activity is local to this browser.")
      .replace("Preview mode:</b> data is saved in this browser’s local storage and is not shared with other visitors or devices. To collect live customer data across devices, connect a secure backend before publishing.", "Visitor activity, customer records and bookings are still saved only in this browser. Product, caption and story edits publish to the shared storefront.");
    setupGitHubPublisher(root);
    $(".admin-tabs", root).insertAdjacentHTML("beforeend", '<button class="admin-tab" data-tab="catalog">Products</button>');
    root.insertAdjacentHTML("beforeend", '<section class="admin-section" id="admin-catalog" hidden></section>');
    setAdminAccess(false);
    refreshAdmin();
    renderCaptionEditor();
    renderStoryEditor();
    renderCatalogEditor();
    $$(".admin-tab", root).forEach(function (tab) {
      tab.addEventListener("click", function () {
        $$(".admin-tab", root).forEach(function (button) { button.classList.toggle("active", button === tab); });
        $$(".admin-section", root).forEach(function (section) {
          var visible = section.id === "admin-" + tab.dataset.tab;
          section.hidden = !visible;
          section.style.display = visible ? "" : "none";
        });
      });
    });
    $("#admin-export").addEventListener("click", exportBookings);
    $("#admin-clear").addEventListener("click", function () {
      if (!window.confirm("Clear all preview bookings, customer records and analytics from this browser?")) return;
      [keys.customers, keys.bookings, keys.events, keys.inspiration, keys.accounts].forEach(function (key) { localStorage.removeItem(key); });
      sessionStorage.removeItem("crystal_current_email");
      refreshAdmin();
    });
  }
  function countsBy(events, type) {
    var result = {};
    events.filter(function (event) { return event.type === type && event.item; }).forEach(function (event) {
      result[event.item] = (result[event.item] || 0) + 1;
    });
    return Object.keys(result).map(function (name) { return [name, result[name]]; }).sort(function (a, b) { return b[1] - a[1]; });
  }
  function rankHtml(rows, empty) {
    if (!rows.length) return '<p class="empty-state">' + empty + '</p>';
    return '<ol class="rank-list">' + rows.map(function (row) { return "<li><span>" + escapeHtml(row[0]) + "</span><b>" + row[1] + "</b></li>"; }).join("") + "</ol>";
  }
  function renderCatalogEditor(selectedKind) {
    var host = $("#admin-catalog");
    if (!host) return;
    var activeKind = selectedKind === "accessory" ? "accessory" : "design";
    var sectionName = activeKind === "accessory" ? "accessories" : "collection";
    var minImageSlots = 3;
    var products = (activeKind === "accessory" ? accessories : works).map(function (item) {
      return { item: item, kind: activeKind };
    });
    var rows = products.map(function (entry) {
      return '<tr><td>' + escapeHtml(entry.item.name) + '</td><td>' + (entry.kind === "design" ? "Custom design" : "Accessory") + '</td><td>' + escapeHtml(entry.item.category) + '</td><td><button class="admin-btn" type="button" data-product-edit="' + entry.kind + ':' + escapeHtml(entry.item.id) + '">Edit</button> <button class="admin-btn" type="button" data-product-delete="' + entry.kind + ':' + escapeHtml(entry.item.id) + '">Remove</button></td></tr>';
    }).join("");
    host.innerHTML = '<div class="admin-panel"><p class="eyebrow">KEEP THE COLLECTION CURRENT</p><h2>Add or edit products</h2><p class="catalog-help">Changes publish to the shared storefront through GitHub Pages. Use image paths in the site assets folder or HTTPS image URLs; uploaded images are added to the repository.</p><form id="product-form" class="product-form"><input type="hidden" name="id"><div class="product-editor-grid"><label>Product type<select name="kind"><option value="design">Custom design</option><option value="accessory">Accessory</option></select></label><label>Name<input name="name" required></label><label>Category<input name="category" required placeholder="Evening, Bags, Hair…"></label><label>Main image path<input name="image" placeholder="assets/my-design.jpg"></label><label class="product-extra-images">More picture paths<input name="images" placeholder="assets/detail-1.jpg, assets/detail-2.jpg"></label><label data-product-field="design">Made for<textarea name="recipient" rows="2"></textarea></label><label data-product-field="accessory">Accessory artwork<select name="type"><option value="clutch">Clutch</option><option value="headwrap">Headwrap</option><option value="tote">Tote</option><option value="necklace">Necklace</option><option value="scrunchie">Scrunchie</option></select></label><label data-product-field="accessory">Price in ₦<input name="price" type="number" min="0" step="1"></label><label>Tagline<input name="tagline"></label><label class="product-description">Description<textarea name="description" rows="3"></textarea></label></div><div class="product-form-actions"><button class="button" type="submit">Publish product <span>↗</span></button><button class="admin-btn" id="product-cancel-edit" type="button" hidden>Cancel edit</button><span class="product-save-message" aria-live="polite"></span></div></form></div><div class="admin-panel"><h2>Current products · ' + products.length + '</h2>' + (products.length ? '<div class="admin-table-wrap"><table class="admin-table product-admin-table"><thead><tr><th>Name</th><th>Type</th><th>Category</th><th>Actions</th></tr></thead><tbody>' + rows + '</tbody></table></div>' : '<p class="empty-state">No products in the catalog yet.</p>') + '</div>';
    var panels = $$(".admin-panel", host);
    $("h2", panels[0]).textContent = "Add or edit " + sectionName;
    $("h2", panels[1]).textContent = (activeKind === "accessory" ? "Current accessories" : "Current collection products") + " · " + products.length;
    var typeTabs = document.createElement("nav");
    typeTabs.className = "catalog-kind-tabs";
    typeTabs.setAttribute("aria-label", "Product type");
    typeTabs.innerHTML = '<button class="catalog-kind-tab' + (activeKind === "design" ? " active" : "") + '" type="button" data-catalog-kind="design" aria-pressed="' + (activeKind === "design") + '">Collection</button><button class="catalog-kind-tab' + (activeKind === "accessory" ? " active" : "") + '" type="button" data-catalog-kind="accessory" aria-pressed="' + (activeKind === "accessory") + '">Accessories</button>';
    host.insertBefore(typeTabs, host.firstChild);
    var form = $("#product-form", host);
    form.elements.kind.value = activeKind;
    form.elements.kind.parentNode.hidden = true;
    var oldMainImageField = form.elements.image.parentNode;
    var oldGalleryField = $(".product-extra-images", form);
    var imageManager = document.createElement("div");
    imageManager.className = "product-image-manager";
    imageManager.innerHTML = '<div class="product-image-heading"><span>First picture is the cover shown in the collection.</span></div><div class="product-image-list"></div><button class="admin-btn product-add-image" type="button">+ Add picture</button>';
    oldMainImageField.replaceWith(imageManager);
    if (oldGalleryField) oldGalleryField.remove();
    var imageList = $(".product-image-list", imageManager);
    $(".catalog-help", host).textContent = "Edit product names, descriptions, regular and sale prices, sizes, stock, new status and photos here. Leave sale price blank when the item is not discounted. Accessory galleries start with placeholder atelier photos; replace them with product photos. Save to commit changes to GitHub; GitHub Pages deploys them to the live site.";
    var message = $(".product-save-message", host);
    var submit = $('button[type="submit"]', form);
    var editKind = "";
    var editorGrid = $(".product-editor-grid", form);
    var editorFields = {
      kind: form.elements.kind.parentNode,
      name: form.elements.name.parentNode,
      category: form.elements.category.parentNode,
      recipient: form.elements.recipient.parentNode,
      type: form.elements.type.parentNode,
      price: form.elements.price.parentNode,
      tagline: form.elements.tagline.parentNode,
      description: form.elements.description.parentNode
    };
    editorFields.price.removeAttribute("data-product-field");
    editorFields.price.firstChild.textContent = "Regular price in ₦";
    function productInputField(labelText, name, type, placeholder) {
      var label = document.createElement("label");
      label.appendChild(document.createTextNode(labelText));
      var input = document.createElement("input");
      input.name = name;
      input.type = type;
      input.placeholder = placeholder || "";
      if (type === "number") {
        input.min = "0";
        input.step = "1";
      }
      label.appendChild(input);
      return label;
    }
    var salePriceField = productInputField("Sale price in ₦ (optional)", "salePrice", "number", "Leave blank when not discounted");
    var sizesField = productInputField("Available sizes (comma-separated)", "sizes", "text", "XS, S, M, L, XL");
    var quantityField = productInputField("Quantity in stock (optional)", "quantity", "number", "Leave blank if not tracked");
    var isNewField = document.createElement("label");
    isNewField.className = "product-new-field";
    var isNewInput = document.createElement("input");
    isNewInput.type = "checkbox";
    isNewInput.name = "isNew";
    isNewField.appendChild(isNewInput);
    isNewField.appendChild(document.createTextNode(" Mark this product as new"));
    function editorSection(title, fields, sectionClass) {
      var section = document.createElement("section");
      section.className = "product-editor-section" + (sectionClass ? " " + sectionClass : "");
      var heading = document.createElement("h3");
      heading.textContent = title;
      var content = document.createElement("div");
      content.className = "product-editor-section-fields";
      fields.forEach(function (field) { content.appendChild(field); });
      section.appendChild(heading);
      section.appendChild(content);
      return section;
    }
    editorGrid.className = "product-editor-sections";
    editorGrid.innerHTML = "";
    editorGrid.appendChild(editorSection("Basics", [editorFields.kind, editorFields.name, editorFields.category], "product-editor-basics"));
    editorGrid.appendChild(editorSection("Pricing and availability", [editorFields.price, salePriceField, sizesField, quantityField, isNewField], "product-editor-pricing"));
    editorGrid.appendChild(editorSection("Details", [editorFields.recipient, editorFields.type, editorFields.tagline, editorFields.description], "product-editor-details"));
    editorGrid.appendChild(editorSection("Pictures", [imageManager], "product-editor-pictures"));
    function updateImageRows() {
      $$(".product-image-row", imageList).forEach(function (row, index) {
        var source = row.dataset.imageSource || $(".product-image-path", row).value.trim();
        var title = index === 0 ? "Main picture" : "Picture " + (index + 1);
        row.dataset.imageSource = source;
        $(".product-image-title", row).textContent = title;
        $(".product-image-preview img", row).alt = title;
        $(".product-image-preview img", row).hidden = !source;
        $(".product-image-empty", row).hidden = !!source;
        if (source) $(".product-image-preview img", row).src = source;
        else $(".product-image-preview img", row).removeAttribute("src");
        $(".product-image-upload-text", row).textContent = source ? "Replace" : "Add";
        $(".product-image-remove", row).hidden = !source;
        $(".product-image-main", row).hidden = index === 0 || !source;
      });
    }
    function addImageRow(src) {
      var row = document.createElement("div");
      row.className = "product-image-row";
      row.dataset.imageSource = src || "";
      var title = document.createElement("b");
      title.className = "product-image-title";
      var preview = document.createElement("div");
      preview.className = "product-image-preview";
      var previewImage = document.createElement("img");
      previewImage.alt = "";
      previewImage.hidden = true;
      var emptyPreview = document.createElement("span");
      emptyPreview.className = "product-image-empty";
      emptyPreview.textContent = "No picture";
      previewImage.addEventListener("error", function () {
        previewImage.hidden = true;
        emptyPreview.hidden = false;
        emptyPreview.textContent = "Preview unavailable";
      });
      preview.appendChild(previewImage);
      preview.appendChild(emptyPreview);
      var label = document.createElement("label");
      label.className = "product-image-path-label";
      var labelText = document.createElement("span");
      labelText.textContent = "Image path or URL";
      var input = document.createElement("input");
      input.className = "product-image-path";
      title.textContent = "Product image";
      input.type = "text";
      input.name = "productImage";
      input.placeholder = "assets/product-detail.jpg";
      input.value = src && src.indexOf("data:image/jpeg;base64,") === 0 ? "" : (src || "");
      input.addEventListener("input", function () {
        row.dataset.imageSource = input.value.trim();
        updateImageRows();
      });
      label.appendChild(labelText);
      label.appendChild(input);
      var uploadButton = document.createElement("button");
      uploadButton.type = "button";
      uploadButton.className = "admin-btn product-image-upload";
      var uploadText = document.createElement("span");
      uploadText.className = "product-image-upload-text";
      var fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/*";
      fileInput.hidden = true;
      uploadButton.appendChild(uploadText);
      uploadButton.addEventListener("click", function () { fileInput.click(); });
      fileInput.addEventListener("change", function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        if (file.type.indexOf("image/") !== 0) {
          message.textContent = "Choose an image file to add to the gallery.";
          fileInput.value = "";
          return;
        }
        message.textContent = "Preparing picture…";
        compressImageFile(file).then(function (imageData) {
          row.dataset.imageSource = imageData;
          input.value = "";
          updateImageRows();
          message.textContent = "Picture ready. Save the product to keep it.";
        }).catch(function (error) {
          message.textContent = "We couldn’t prepare that picture: " + error.message;
        }).then(function () {
          fileInput.value = "";
        });
      });
      var makeMain = document.createElement("button");
      makeMain.type = "button";
      makeMain.className = "admin-btn product-image-main";
      makeMain.textContent = "Make main";
      makeMain.addEventListener("click", function () {
        imageList.insertBefore(row, imageList.firstChild);
        updateImageRows();
      });
      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "admin-btn product-image-remove";
      remove.textContent = "Remove";
      remove.addEventListener("click", function () {
        if ($$(".product-image-row", imageList).length <= minImageSlots) {
          row.dataset.imageSource = "";
          input.value = "";
          updateImageRows();
          message.textContent = "Picture removed. This slot is ready for another photo.";
          return;
        }
        row.remove();
        updateImageRows();
      });
      var controls = document.createElement("div");
      controls.className = "product-image-controls";
      controls.appendChild(uploadButton);
      controls.appendChild(fileInput);
      controls.appendChild(makeMain);
      controls.appendChild(remove);
      row.appendChild(title);
      row.appendChild(preview);
      row.appendChild(label);
      row.appendChild(controls);
      imageList.appendChild(row);
      updateImageRows();
    }
    function setImageRows(images) {
      imageList.innerHTML = "";
      var slots = images.slice();
      while (slots.length < minImageSlots) slots.push("");
      slots.forEach(addImageRow);
    }
    $(".product-add-image", imageManager).addEventListener("click", function () { addImageRow(""); });
    setImageRows([]);
    var updateFields = function () {
      form.elements.kind.value = editKind || activeKind;
      var isAccessory = form.elements.kind.value === "accessory";
      $$("[data-product-field]", form).forEach(function (field) {
        field.hidden = field.dataset.productField !== (isAccessory ? "accessory" : "design");
      });
    };
    form.elements.kind.addEventListener("change", updateFields);
    updateFields();
    function hasUnsavedProductChanges() {
      if (form.elements.id.value || isNewInput.checked) return true;
      var names = ["name", "category", "recipient", "price", "salePrice", "sizes", "quantity", "tagline", "description"];
      if (names.some(function (name) { return String(form.elements[name].value || "").trim() !== ""; })) return true;
      return $$(".product-image-row", imageList).some(function (row) {
        return (row.dataset.imageSource || $(".product-image-path", row).value.trim()) !== "";
      });
    }
    $$(".catalog-kind-tab", typeTabs).forEach(function (button) {
      button.addEventListener("click", function () {
        var nextKind = button.dataset.catalogKind;
        if (nextKind === activeKind) return;
        if (hasUnsavedProductChanges() && !window.confirm("Switching sections will discard this unsaved product. Continue?")) return;
        renderCatalogEditor(nextKind);
      });
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!githubToken) { message.textContent = "Connect GitHub above before publishing products."; return; }
      var data = new FormData(form);
      var kind = String(data.get("kind") || "design");
      var name = String(data.get("name") || "").trim();
      var category = String(data.get("category") || "").trim();
      var rawPrice = String(data.get("price") || "").trim();
      var rawSalePrice = String(data.get("salePrice") || "").trim();
      var rawQuantity = String(data.get("quantity") || "").trim();
      var regularPrice = rawPrice === "" ? null : Number(rawPrice);
      var discountedPrice = rawSalePrice === "" ? null : Number(rawSalePrice);
      var quantity = rawQuantity === "" ? null : Number(rawQuantity);
      var sizes = String(data.get("sizes") || "").split(",").map(function (size) { return size.trim(); }).filter(Boolean);
      var allImages = $$(".product-image-row", imageList).map(function (row) {
        return row.dataset.imageSource || $(".product-image-path", row).value.trim();
      }).filter(Boolean);
      var id = String(data.get("id") || "");
      var nextWorks = works.slice();
      var nextAccessories = accessories.slice();
      var target = kind === "accessory" ? nextAccessories : nextWorks;
      if (!name || !category) { message.textContent = "Add a product name and category."; return; }
      if (kind === "accessory" && regularPrice === null) { message.textContent = "Add a regular price for this accessory."; return; }
      if (regularPrice !== null && (!Number.isFinite(regularPrice) || regularPrice < 0)) { message.textContent = "Enter a valid regular price."; return; }
      if (discountedPrice !== null && (!Number.isFinite(discountedPrice) || regularPrice === null || regularPrice <= 0 || discountedPrice < 0 || discountedPrice >= regularPrice)) {
        message.textContent = "Sale price must be lower than the regular price.";
        return;
      }
      if (quantity !== null && (!Number.isInteger(quantity) || quantity < 0)) { message.textContent = "Enter a whole number for quantity."; return; }
      if (kind === "design" && !allImages.length) { message.textContent = "Add a cover image path for a custom design."; return; }
      if (allImages.some(function (src) {
        return /^(javascript|file):/i.test(src) || (/^data:/i.test(src) && !/^data:image\/jpeg;base64,/i.test(src));
      })) {
        message.textContent = "Use an image uploaded from your device, a site asset path, or an HTTPS image URL.";
        return;
      }
      if (!id) {
        id = kind + "-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        var baseId = id;
        var suffix = 2;
        while (works.concat(accessories).some(function (item) { return item.id === id; })) id = baseId + "-" + suffix++;
      }
        var index = target.findIndex(function (entry) { return entry.id === id; });
      var item = {
        id: id,
        name: name,
        category: category,
        image: allImages[0] || "",
        images: allImages,
        tagline: String(data.get("tagline") || "").trim(),
        description: String(data.get("description") || "").trim(),
        price: regularPrice,
        salePrice: discountedPrice,
        sizes: sizes,
        quantity: quantity,
        isNew: data.get("isNew") === "on"
      };
      if (kind === "design") {
        item.recipient = String(data.get("recipient") || "").trim();
        if (index !== -1) item.relatedAccessories = target[index].relatedAccessories || [];
      }
      else {
        item.type = String(data.get("type") || "clutch");
      }
      if (index === -1) target.unshift(item);
      else target[index] = item;
      message.textContent = "Publishing product to GitHub…";
      publishSiteContent({ products: { works: nextWorks, accessories: nextAccessories } }).then(function () {
        record(index === -1 ? "product_added" : "product_updated", item.name);
        renderCatalogEditor(activeKind);
        renderCaptionEditor();
        setGitHubStatus("Product published to GitHub. GitHub Pages will update after deployment finishes.");
      }).catch(function (error) {
        message.textContent = "We couldn’t publish this product: " + error.message;
      });
    });
    $("#product-cancel-edit", host).addEventListener("click", function () { renderCatalogEditor(activeKind); });
    $$("[data-product-edit]", host).forEach(function (button) {
      button.addEventListener("click", function () {
        var parts = button.dataset.productEdit.split(":");
        var list = parts[0] === "accessory" ? accessories : works;
        var item = list.find(function (entry) { return entry.id === parts[1]; });
        if (!item) return;
        editKind = parts[0];
        form.elements.id.value = item.id;
        form.elements.kind.value = parts[0];
        form.elements.name.value = item.name;
        form.elements.category.value = item.category;
        setImageRows(itemImages(item));
        form.elements.recipient.value = item.recipient || "";
        form.elements.type.value = item.type || "clutch";
        form.elements.price.value = item.price === null || item.price === undefined ? "" : item.price;
        form.elements.salePrice.value = item.salePrice === null || item.salePrice === undefined ? "" : item.salePrice;
        form.elements.sizes.value = productSizes(item).join(", ");
        form.elements.quantity.value = item.quantity === null || item.quantity === undefined ? "" : item.quantity;
        form.elements.isNew.checked = item.isNew === true;
        form.elements.tagline.value = item.tagline || "";
        form.elements.description.value = item.description || "";
        submit.innerHTML = 'Save changes <span>↗</span>';
        $("#product-cancel-edit", host).hidden = false;
        updateFields();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    $$("[data-product-delete]", host).forEach(function (button) {
      button.addEventListener("click", function () {
        if (!window.confirm("Remove this product from the storefront catalog?")) return;
        var parts = button.dataset.productDelete.split(":");
        if (!githubToken) {
          setGitHubStatus("Connect GitHub above before removing products.");
          return;
        }
        var nextWorks = works.filter(function (item) { return !(parts[0] === "design" && item.id === parts[1]); });
        var nextAccessories = accessories.filter(function (item) { return !(parts[0] === "accessory" && item.id === parts[1]); });
        publishSiteContent({ products: { works: nextWorks, accessories: nextAccessories } }).then(function () {
          record("product_removed", itemName(parts[1]));
          renderCatalogEditor(activeKind);
          renderCaptionEditor();
          setGitHubStatus("Product removed from the live catalog. GitHub Pages will update after deployment finishes.");
        }).catch(function (error) {
          setGitHubStatus("Could not remove product: " + error.message);
        });
      });
    });
  }
  function bookingTable(bookings) {
    if (!bookings.length) return '<p class="empty-state">No fitting requests yet. New requests will appear here.</p>';
    return '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Customer</th><th>Contact</th><th>Service</th><th>Preferred appointment</th><th>Requested</th></tr></thead><tbody>' + bookings.map(function (booking) {
      return "<tr><td><b>" + escapeHtml(booking.name) + "</b></td><td>" + escapeHtml(booking.phone) + (booking.email ? "<br>" + escapeHtml(booking.email) : "") + "</td><td>" + escapeHtml(booking.service) + (booking.notes ? "<br><span style=\"color:#888\">" + escapeHtml(booking.notes) + "</span>" : "") + "</td><td>" + escapeHtml(formatDate(booking.date)) + "<br>" + escapeHtml(booking.time) + "</td><td>" + escapeHtml(formatDate(booking.createdAt)) + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  }
  function accessoryOrderTable(events) {
    if (!events.length) return '<p class="empty-state">No accessory WhatsApp order links have been clicked yet.</p>';
    return '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Customer / account</th><th>Accessory</th><th>Clicked</th></tr></thead><tbody>' + events.slice().reverse().slice(0, 20).map(function (event) {
      var clickedAt = new Date(event.at);
      return "<tr><td>" + escapeHtml(event.extra || "Guest (not signed in)") + "</td><td>" + escapeHtml(event.item || "—") + "</td><td>" + escapeHtml(isNaN(clickedAt.getTime()) ? "—" : clickedAt.toLocaleString("en-GB")) + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  }
  function refreshAdmin() {
    var customers = read(keys.customers, []);
    var bookings = read(keys.bookings, []);
    var events = read(keys.events, []);
    var designsViewed = countsBy(events, "design_view");
    var accessoriesViewed = countsBy(events, "accessory_view");
    var accessoryOrderEvents = events.filter(function (event) { return event.type === "whatsapp_accessory_order_opened"; });
    var accessoryOrderCounts = countsBy(events, "whatsapp_accessory_order_opened");
    var inspiration = allInspirations().map(function (id) { return [itemName(id), 1]; });
    $("#admin-overview").innerHTML = '<div class="stat-grid"><div class="stat-card"><span>Page views</span><b>' + events.filter(function (event) { return event.type === "page_view"; }).length + '</b></div><div class="stat-card"><span>Fitting requests</span><b>' + bookings.length + '</b></div><div class="stat-card"><span>Registered customers</span><b>' + customers.length + '</b></div><div class="stat-card"><span>Design views</span><b>' + events.filter(function (event) { return event.type === "design_view"; }).length + '</b></div><div class="stat-card"><span>Saved inspirations</span><b>' + events.filter(function (event) { return event.type === "inspiration_saved"; }).length + '</b></div></div><div class="admin-columns"><article class="admin-panel"><h2>Latest fitting requests</h2>' + bookingTable(bookings.slice(0, 5)) + '</article><article class="admin-panel"><h2>Most viewed designs</h2>' + rankHtml(designsViewed.slice(0, 5), "Design views will appear when someone opens a design story.") + '<h3 style="margin-top:19px">Most viewed accessories</h3>' + rankHtml(accessoriesViewed.slice(0, 5), "Accessory views will appear here.") + '</article></div><div class="admin-panel"><h2>Recent customer sign-ups</h2>' + customerTable(customers.slice(0, 5)) + '</div>';
    $("#admin-overview .stat-grid").insertAdjacentHTML("beforeend", '<div class="stat-card"><span>Accessory WhatsApp order clicks</span><b>' + accessoryOrderEvents.length + '</b></div>');
    $("#admin-overview").insertAdjacentHTML("beforeend", '<div class="admin-panel"><h2>Recent accessory WhatsApp order clicks</h2>' + accessoryOrderTable(accessoryOrderEvents) + '<p class="admin-note">These are clicks to open WhatsApp, not confirmed purchases. Guest clicks are shown without customer identity.</p></div>');
    $("#admin-bookings").innerHTML = '<div class="admin-panel"><h2>Fitting requests · ' + bookings.length + '</h2>' + bookingTable(bookings) + '</div>';
    $("#admin-customers").innerHTML = '<div class="admin-panel"><h2>Registered customers · ' + customers.length + '</h2>' + customerTable(customers) + '</div>';
    $("#admin-interest").innerHTML = '<div class="admin-columns"><article class="admin-panel"><h2>Most viewed designs</h2>' + rankHtml(designsViewed, "Open a design to begin seeing interest.") + '</article><article class="admin-panel"><h2>Most viewed accessories</h2>' + rankHtml(accessoriesViewed, "Open an accessory to see its views.") + '</article></div><div class="admin-panel"><h2>Saved to inspiration</h2>' + rankHtml(inspiration, "No designs saved to inspiration yet.") + '</div><div class="admin-note">Popularity counts reflect detail views and saves made from this browser only. The site does not use third-party analytics.</div>';
    $("#admin-interest").insertAdjacentHTML("beforeend", '<div class="admin-panel"><h2>Accessory WhatsApp order clicks by product</h2>' + rankHtml(accessoryOrderCounts, "No accessory WhatsApp order links have been clicked yet.") + '</div>');
  }
  function customerTable(customers) {
    if (!customers.length) return '<p class="empty-state">No customers yet. Sign-ups and fitting requests will appear here.</p>';
    return '<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Email updates</th><th>Source</th></tr></thead><tbody>' + customers.map(function (customer) {
      return "<tr><td><b>" + escapeHtml(customer.name) + "</b></td><td>" + escapeHtml(customer.email || "—") + "</td><td>" + escapeHtml(customer.phone || "—") + "</td><td>" + escapeHtml(formatDate(customer.createdAt)) + "</td><td>" + (customer.emailOptInAt ? "Yes" : "No") + "</td><td>" + escapeHtml(customer.source || "Website") + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  }
  function renderStoryEditor() {
    var host = $("#admin-story");
    if (!host) return;
    var content = getStoryContent();
    var groups = [
      {
        title: "Opening",
        fields: [
          { key: "heroEyebrow", label: "Eyebrow" },
          { key: "heroTitle", label: "Headline line 1" },
          { key: "heroTitleAccent", label: "Headline line 2" },
          { key: "heroIntro", label: "Introduction", type: "textarea" },
          { key: "ribbon", label: "Moving ribbon text", type: "textarea" }
        ]
      },
      {
        title: "Chapter 1 · How it begins",
        imageKey: "chapterOneImage",
        altKey: "chapterOneAlt",
        fields: [
          { key: "chapterOneEyebrow", label: "Section label" },
          { key: "chapterOneHeading", label: "Heading line 1" },
          { key: "chapterOneAccent", label: "Highlighted heading" },
          { key: "chapterOneParagraphOne", label: "Paragraph 1", type: "textarea" },
          { key: "chapterOneParagraphTwo", label: "Paragraph 2", type: "textarea" },
          { key: "chapterOneImageNote", label: "Photo caption", type: "textarea" },
          { key: "chapterOneLink", label: "Link label" }
        ]
      },
      {
        title: "Chapter 2 · The craft",
        imageKey: "chapterTwoImage",
        altKey: "chapterTwoAlt",
        fields: [
          { key: "chapterTwoEyebrow", label: "Section label" },
          { key: "chapterTwoHeading", label: "Heading line 1" },
          { key: "chapterTwoAccent", label: "Highlighted heading" },
          { key: "chapterTwoParagraphOne", label: "Paragraph 1", type: "textarea" },
          { key: "chapterTwoParagraphTwo", label: "Paragraph 2", type: "textarea" },
          { key: "chapterTwoImageNote", label: "Photo caption", type: "textarea" },
          { key: "chapterTwoLink", label: "Link label" }
        ]
      },
      {
        title: "Chapter 3 · The finishing touch",
        imageKey: "chapterThreeImage",
        altKey: "chapterThreeAlt",
        fields: [
          { key: "chapterThreeEyebrow", label: "Section label" },
          { key: "chapterThreeHeading", label: "Heading line 1" },
          { key: "chapterThreeAccent", label: "Highlighted heading" },
          { key: "chapterThreeParagraphOne", label: "Paragraph 1", type: "textarea" },
          { key: "chapterThreeParagraphTwo", label: "Paragraph 2", type: "textarea" },
          { key: "chapterThreeImageNote", label: "Photo caption", type: "textarea" },
          { key: "chapterThreeLink", label: "Link label" }
        ]
      },
      {
        title: "Atelier values",
        fields: [
          { key: "valueOneTitle", label: "Value 1 title" },
          { key: "valueOneText", label: "Value 1 description", type: "textarea" },
          { key: "valueTwoTitle", label: "Value 2 title" },
          { key: "valueTwoText", label: "Value 2 description", type: "textarea" },
          { key: "valueThreeTitle", label: "Value 3 title" },
          { key: "valueThreeText", label: "Value 3 description", type: "textarea" }
        ]
      },
      {
        title: "Custom design journey",
        fields: [
          { key: "journeyEyebrow", label: "Section label" },
          { key: "journeyHeading", label: "Heading line 1" },
          { key: "journeyAccent", label: "Highlighted heading" },
          { key: "stepOneTitle", label: "Step 1 title" },
          { key: "stepOneText", label: "Step 1 description", type: "textarea" },
          { key: "stepTwoTitle", label: "Step 2 title" },
          { key: "stepTwoText", label: "Step 2 description", type: "textarea" },
          { key: "stepThreeTitle", label: "Step 3 title" },
          { key: "stepThreeText", label: "Step 3 description", type: "textarea" },
          { key: "stepFourTitle", label: "Step 4 title" },
          { key: "stepFourText", label: "Step 4 description", type: "textarea" }
        ]
      },
      {
        title: "Closing call to action",
        fields: [
          { key: "closingEyebrow", label: "Section label" },
          { key: "closingHeading", label: "Heading line 1" },
          { key: "closingAccent", label: "Highlighted heading" },
          { key: "closingIntro", label: "Introduction", type: "textarea" },
          { key: "closingFittingLink", label: "Fitting button label" },
          { key: "closingDesignLink", label: "Design button label" }
        ]
      }
    ];
    function renderField(field) {
      var value = content.copy[field.key];
      var control = field.type === "textarea"
        ? '<textarea rows="3" data-story-copy-field="' + field.key + '">' + escapeHtml(value) + "</textarea>"
        : '<input type="text" data-story-copy-field="' + field.key + '" value="' + escapeHtml(value) + '">';
      return '<label class="story-admin-field' + (field.type === "textarea" ? " story-admin-field-wide" : "") + '">' + escapeHtml(field.label) + control + "</label>";
    }
    function renderImageEditor(group) {
      return '<div class="story-admin-image-editor" data-story-image-editor><div class="story-admin-image-preview"><img data-story-image-preview alt=""><span data-story-image-empty>Photo preview</span></div><div class="story-admin-image-fields"><label>Photo path or HTTPS URL<input type="text" data-story-image-input="' + group.imageKey + '" value="' + escapeHtml(content.images[group.imageKey]) + '" placeholder="assets/story-photo.jpg"></label><label>Photo description (alt text)<input type="text" data-story-alt-input="' + group.altKey + '" value="' + escapeHtml(content.alts[group.altKey]) + '"></label><div class="story-admin-image-actions"><button class="admin-btn" type="button" data-story-image-pick>Choose photo</button><input type="file" accept="image/*" data-story-file-input hidden><button class="admin-btn" type="button" data-story-image-remove>Remove photo</button></div></div></div>';
    }
    host.innerHTML = '<div class="admin-panel"><p class="eyebrow">SHAPE THE STORY</p><h2>Edit the Our Story page</h2><p class="catalog-help">Update page copy, captions and photographs. Save to publish the changes to the live site.</p><form id="story-editor-form" class="story-admin-form">' + groups.map(function (group, index) {
      return '<details class="story-admin-group"' + (index === 0 ? " open" : "") + '><summary>' + escapeHtml(group.title) + '</summary><div class="story-admin-group-content"><div class="story-admin-fields">' + group.fields.map(renderField).join("") + '</div>' + (group.imageKey ? renderImageEditor(group) : "") + '</div></details>';
    }).join("") + '<div class="product-form-actions"><button class="button" type="submit">Save story changes <span>↗</span></button><span class="story-save-message" aria-live="polite"></span></div></form></div>';
    var form = $("#story-editor-form", host);
    var message = $(".story-save-message", form);
    $$("[data-story-image-editor]", form).forEach(function (editor) {
      var input = $("[data-story-image-input]", editor);
      var altInput = $("[data-story-alt-input]", editor);
      var preview = $("[data-story-image-preview]", editor);
      var emptyPreview = $("[data-story-image-empty]", editor);
      var fileInput = $("[data-story-file-input]", editor);
      var pickButton = $("[data-story-image-pick]", editor);
      var removeButton = $("[data-story-image-remove]", editor);
      function updatePreview() {
        var source = input.value.trim();
        if (source && validStoryImageSource(source)) {
          preview.src = source;
          preview.hidden = false;
          emptyPreview.hidden = true;
        } else {
          preview.removeAttribute("src");
          preview.hidden = true;
          emptyPreview.hidden = false;
          emptyPreview.textContent = source ? "Preview unavailable" : "Photo preview";
        }
        pickButton.textContent = source ? "Replace photo" : "Choose photo";
      }
      input.addEventListener("input", updatePreview);
      altInput.addEventListener("input", function () { preview.alt = altInput.value; });
      preview.addEventListener("error", function () {
        preview.hidden = true;
        emptyPreview.hidden = false;
        emptyPreview.textContent = "Preview unavailable";
      });
      pickButton.addEventListener("click", function () { fileInput.click(); });
      fileInput.addEventListener("change", function () {
        var file = fileInput.files && fileInput.files[0];
        if (!file) return;
        if (file.type.indexOf("image/") !== 0) {
          message.textContent = "Choose an image file for the story page.";
          fileInput.value = "";
          return;
        }
        message.textContent = "Preparing photo…";
        compressImageFile(file).then(function (imageData) {
          input.value = imageData;
          updatePreview();
          message.textContent = "Photo ready. Save the story page to keep it.";
        }).catch(function (error) {
          message.textContent = "We couldn’t prepare that photo: " + error.message;
        }).then(function () {
          fileInput.value = "";
        });
      });
      removeButton.addEventListener("click", function () {
        input.value = "";
        updatePreview();
      });
      preview.alt = altInput.value;
      updatePreview();
    });
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!githubToken) { message.textContent = "Connect GitHub above before publishing story changes."; return; }
      var copy = {};
      var images = {};
      var alts = {};
      var invalidImageField = null;
      $$("[data-story-copy-field]", form).forEach(function (field) { copy[field.dataset.storyCopyField] = field.value.trim(); });
      $$("[data-story-image-input]", form).forEach(function (field) {
        var source = field.value.trim();
        if (source && !validStoryImageSource(source)) {
          invalidImageField = field;
          return;
        }
        images[field.dataset.storyImageInput] = source;
      });
      if (invalidImageField) {
        message.textContent = "Use an image uploaded from your device, a site asset path, or an HTTPS image URL.";
        invalidImageField.focus();
        return;
      }
      if (Object.keys(images).length !== Object.keys(storyDefaults.images).length) return;
      $$("[data-story-alt-input]", form).forEach(function (field) { alts[field.dataset.storyAltInput] = field.value.trim(); });
      message.textContent = "Publishing story changes to GitHub…";
      publishSiteContent({ story: { copy: copy, images: images, alts: alts } }).then(function () {
        var storedStory = read(keys.story, {});
        $$("[data-story-image-input]", form).forEach(function (field) {
          field.value = storedStory.images[field.dataset.storyImageInput];
          field.dispatchEvent(new Event("input"));
        });
        record("story_content_updated");
        message.textContent = "Published. The live page will update after GitHub Pages finishes deploying.";
        setGitHubStatus("Story changes committed. GitHub Pages deployment is in progress.");
      }).catch(function (error) {
        message.textContent = "We couldn’t publish the story changes: " + error.message;
      });
    });
  }
  function renderCaptionEditor() {
    var host = $("#admin-captions");
    if (!host) return;
    var captions = read(keys.captions, {});
    host.innerHTML = '<div class="admin-panel"><p class="eyebrow">THE WORDS THAT MAKE IT HERS</p><h2>Design captions</h2><p style="font-size:11px;color:var(--muted)">Personalise each design’s tagline and who it was made for. Save to publish changes to the live site.</p><form id="caption-form">' + works.map(function (item) {
      var text = captions[item.id] || {};
      return '<div class="caption-editor"><h3>' + escapeHtml(item.name) + '</h3><label>Tagline<input data-caption="' + item.id + '" data-field="tagline" value="' + escapeHtml(text.tagline || item.tagline) + '"></label><label>Who it’s for<textarea data-caption="' + item.id + '" data-field="recipient" rows="2">' + escapeHtml(text.recipient || item.recipient) + '</textarea></label></div>';
    }).join("") + '<button class="button" type="submit">Save design captions <span>↗</span></button><span class="caption-save-message" aria-live="polite"></span></form></div>';
    $("#caption-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var updated = {};
      $$("[data-caption]", host).forEach(function (input) {
        var id = input.dataset.caption;
        if (!updated[id]) updated[id] = {};
        updated[id][input.dataset.field] = input.value.trim();
      });
      var message = $(".caption-save-message", host);
      if (!githubToken) { message.textContent = "Connect GitHub above before publishing captions."; return; }
      message.textContent = "Publishing captions to GitHub…";
      publishSiteContent({ captions: updated }).then(function () {
        record("captions_updated");
        message.textContent = "Published. Your design captions will update after GitHub Pages deploys.";
        setGitHubStatus("Design captions committed. GitHub Pages deployment is in progress.");
      }).catch(function (error) {
        message.textContent = "Could not publish captions: " + error.message;
      });
    });
  }
  function exportBookings() {
    var bookings = read(keys.bookings, []);
    var columns = ["Name", "Phone", "Email", "Service", "Preferred date", "Preferred time", "Notes", "Status", "Requested at"];
    var rows = bookings.map(function (booking) {
      return [booking.name, booking.phone, booking.email, booking.service, booking.date, booking.time, booking.notes, booking.status, booking.createdAt];
    });
    var csv = [columns].concat(rows).map(function (row) {
      return row.map(function (value) { return '"' + String(value || "").replace(/"/g, '""') + '"'; }).join(",");
    }).join("\r\n");
    var url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    var link = document.createElement("a");
    link.href = url;
    link.download = "crystal-atelier-fitting-requests.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function initializeApp() {
    var catalog = read(keys.products, null);
    if (catalog && Array.isArray(catalog.works) && Array.isArray(catalog.accessories)) {
      works = catalog.works;
      accessories = catalog.accessories;
    }
    normalizeAccessoryImages();
    applyStoryContent();
    header();
    footer();
    renderCollection();
    setupForms();
    record("page_view", document.body.dataset.page || "");
    if (document.body.dataset.page === "admin") admin();
    if (document.body.dataset.page === "account") renderAccount();
    setupSignupPopup();
    setupStoryMotion();
  }
  loadPublishedContent().then(function () {
    initializeApp();
  }).catch(function (error) {
    publishedContentError = error.message;
    publishedContent = {};
    publishedContentLoaded = false;
    console.error("Could not load shared site content:", error);
    initializeApp();
  });
}());
