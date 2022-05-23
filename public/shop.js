var second
lock = 0
class MobileNavBar {
    constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";

        this.handleClick = this.handleClick.bind(this);
    }

    animateLinks() {
        this.navLinks.forEach((link, index) => {
            if(lock > 0){
                link.style.opacity = 1
                return
            }else{
                link.style.opacity = 0
            }
            if (!link.style.animation) {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`
                return
            }
            link.style.animation = ""
        });
        lock--
    }

    handleClick(start) {
        this.navList.classList.toggle(this.activeClass)
        this.mobileMenu.classList.toggle(this.activeClass);
        this.animateLinks();
    }

    addClickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick)
        this.animateLinks
    }

    init() {
        if (this.mobileMenu) {
            this.addClickEvent()
        }
        return this;
    }
}

const mobileNavBar = new MobileNavBar(
    ".mobile-menu",
    ".shop-nav-list",
    ".shop-nav-list li",
)

mobileNavBar.init();

if (window.matchMedia("(max-width:1020px)").matches) {
    lock = 2
    mobileNavBar.handleClick(true)
}