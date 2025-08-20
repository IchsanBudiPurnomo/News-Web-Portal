const container = document.getElementById("articleContainer");
        const searchInput = document.getElementById("searchInput");
        const filterButtons = document.querySelectorAll(".filter-buttons button");

        let allArticles = []; // semua artikel
        let currentSource = "all"; // default tampil semua

        async function fetchNews() {
            try {
                // API 1: NewsAPI
                const res1 = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=d22b9c3ff0374b1593d277faec215e6e');
                const data1 = await res1.json();
                const articles1 = data1.articles.map(a => ({
                    title: a.title,
                    description: a.description,
                    url: a.url,
                    image: a.urlToImage,
                    publishedAt: a.publishedAt,
                    source: "newsapi"
                }));

                // API 2: GNews
                const res2 = await fetch('https://gnews.io/api/v4/top-headlines?topic=sports&country=id&apikey=63fb45afed5d4fac6b8c986021d20e7c');
                const data2 = await res2.json();
                const articles2 = data2.articles.map(a => ({
                    title: a.title,
                    description: a.description,
                    url: a.url,
                    image: a.image,
                    publishedAt: a.publishedAt,
                    source: "gnews"
                }));

                // API 3: TheNewsAPI
                const res3 = await fetch('https://api.thenewsapi.com/v1/news/top?api_token=l1L2AnrO2WPCIvEAtqdiFkhqP2UnFUn7rroGBDYz&locale=us&limit=5');
                const data3 = await res3.json();
                const articles3 = data3.data.map(a => ({
                    title: a.title,
                    description: a.description,
                    url: a.url,
                    image: a.image_url,
                    publishedAt: a.published_at,
                    source: "thenewsapi"
                }));

                // Masukan semau artikel ke satu array
                allArticles = [...articles1, ...articles2, ...articles3];
                allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

                renderArticles(allArticles);
            } catch (err) {
                console.error("Error fetching news:", err);
            }
        }

        function renderArticles(articles) {
            container.innerHTML = "";
            if (articles.length === 0) {
                container.innerHTML = "<p>No articles found.</p>";
                return;
            }
            articles.forEach(article => {
                const card = document.createElement("div");
                card.className = "card";
                card.innerHTML = `
          <div class="image">
            <img src="${article.image}" alt="News Image">
          </div>
          <div class="desc">
            <a href="${article.url}" target="_blank">${article.title}</a>
            <p>${article.description || ""}</p>
            <p class="meta">${new Date(article.publishedAt).toLocaleString()} | Source: ${article.source}</p>
          </div>
        `;
                container.appendChild(card);
            });
        }

        function searchArticles() {
            const keyword = searchInput.value.toLowerCase().trim();
            let filtered = allArticles;

            if (currentSource !== "all") {
                filtered = filtered.filter(article => article.source === currentSource);
            }

            if (keyword === "") {
                renderArticles(filtered);
                return;
            }

            filtered = filtered.filter(article =>
                (article.title && article.title.toLowerCase().includes(keyword)) ||
                (article.description && article.description.toLowerCase().includes(keyword))
            );

            renderArticles(filtered);
        }

        // Event search
        searchInput.addEventListener("input", searchArticles);

        // Event filter buttons
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentSource = btn.dataset.source;
                searchArticles();
            });
        });

        fetchNews();
