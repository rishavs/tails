

export const toasts = (ctx) => {  
    return /*html*/`
    <div id="success_toast" class="alert alert-success border border-base-300 shadow-lg hidden">
        <span id="success_toast_text"></span>
        <button class="btn btn-circle btn-outline btn-sm justify-self-end" onclick="this.parentNode.classList.add('hidden')">✕</button>
    </div>

    <div role="alert" id="info_toast" class="alert border border-base-300 bg-base-100 shadow-lg hidden">
        <span id="info_toast_text"></span>
        <button class="btn btn-circle btn-outline btn-sm justify-self-end" onclick="this.parentNode.classList.add('hidden')">✕</button>
    </div>

    <div role="alert" id="error_toast" class="auto-hide alert alert-error border border-base-300 shadow-lg hidden">
        <span id="error_toast_text"></span>
        <button class="btn btn-circle btn-outline btn-sm justify-self-end" onclick="this.parentNode.classList.add('hidden')">✕</button>
    </div>


    <script>
        // func which takes input - type of toast, text and renders the toast
        function triggerToast(type, text) {
            if (type =="success") {
                success_toast_text.innerText = text;
                success_toast.classList.remove("hidden");
                success_toast.classList.add("flex");

            } else if (type == "info") {
                info_toast_text.innerText = text;
                info_toast.classList.remove("hidden");
                info_toast.classList.add("flex");

            } else if (type == 'error') {
                error_toast_text.innerText = text;
                error_toast.classList.toggle("hidden");
                error_toast.classList.add("flex");
            }

        }
    </script>
    `
}