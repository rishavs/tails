export const themeModal = () => {
    return /*html*/`
    <dialog id="theme_modal" class="modal modal-bottom lg:modal-middle">
        <div class="modal-box">

            <div class="modal-action">
                <form method="dialog">
                <!-- if there is a button in form, it will close the modal -->
                    <button class="btn btn-square">✕</button>
                </form>
            </div>
            <h3 class="font-bold text-lg text-center">Theme Picker</h3>
            <p class="py-4 text-center">Select a theme for Digglu from the collection below! </p>     
            <div class="divider"></div>   
            ${
                ["acid", "aqua","aquafina", "autumn", "black", "bumblebee", "business", "cmyk",
                "coffee", "corporate", "cupcake", "cyberpunk", "dark", "darksun", "dim", "dracula", "emerald", "fantasy", "forest", "garden", "halloween", "lemonade", "light", "lofi",
                "lux", "luxury", "night", "nord", "pastel", "retro", "sunset", "synthwave", "valentine",
                "winter", "wireframe"].map(theme => /*html*/`
                <input type="radio" name="theme-buttons" class="theme-controller mx-1 my-2 btn join-item" aria-label="${theme}" value="${theme}" />
                `).join('')
            }
        </div>
  </dialog>
  `
}