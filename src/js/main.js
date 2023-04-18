import bootstrap from 'bootstrap';
import throttle from 'lodash.throttle';
import {setVisibilityForCollapseElementControls} from './utils';
import Gallery from './gallery';
import {theme} from './theme';
import RandomTextGenerator from 'random-text-generator';

const mainFlow = () => {
    let loading = false;
    let page = 2;
    let prevScrollY = window.scrollY;

    const limit = 9;
    const url = 'https://picsum.photos/v2/list';
    const loremStr = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores aut, autem consequatur cumque dolores ea exercitationem impedit iure, laboriosam magnam odio recusandae repellat sed suscipit tenetur unde vitae voluptas, voluptate!';
    const gallery = new Gallery({
        galleryElementId: 'gallery',
        templateKeys: ['id', 'image', 'title', 'text'],
        templateKeyPattern: ['//', '//'],
        insertAdjacentElement: ['gallery-item-uploade-more', 'beforebegin'],
    });
    const randomTextGenerator = new RandomTextGenerator({
        minLength: 50, maxLength: 200,
    });
    randomTextGenerator.learn(loremStr);

    theme(); // Check Theme
    const setVisibilityHandlerThrottle = throttle(setVisibilityHandler, 250);
    window.addEventListener('load', setVisibilityHandlerThrottle);
    window.addEventListener('resize', setVisibilityHandlerThrottle);

    document.querySelector('#gallery-upload-more')
        .addEventListener('click', ({target}) => {
            target.disabled = true;
            renderNewElements();
            target.disabled = false;
        });

    const scrollHandlerThrottle = throttle(scrollHandler, 500);
    window.addEventListener('scroll', scrollHandlerThrottle);

    function scrollHandler() {
        if (prevScrollY < window.scrollY) {
            // scroll down
            const body = document.body.offsetHeight * 0.1;
            if (window.scrollY + window.innerHeight >= document.body.offsetHeight - body) {
                if (!loading) {
                    loading = true;
                    renderNewElements();
                    loading = false;
                }
            }
        }
        prevScrollY = window.scrollY;
    }

    function setVisibilityHandler() {
        setVisibilityForCollapseElementControls(
            '.collapse-with-line-clamp',
            (id) => document.querySelector(`[data-bs-target="#${id}"]`)
        );
    }

    async function fetchData() {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`);
        if (response.status !== 200) throw new Error(response.statusText);

        return await response.json();
    }

    function renderNewElements() {
        return fetchData().then(data => {
            for (const {author, download_url, height, id, url, width} of data) {
                const text = randomTextGenerator.generate();

                gallery.addElementToList({
                    id,
                    image: `https://picsum.photos/id/${id}/356/200`,
                    title: author,
                    text,
                });
            }

            page = page + 1;
        }).then(() => {
            setVisibilityHandler()
        }).catch(error => {
            console.warn(error);
        });
    }
};

mainFlow();
