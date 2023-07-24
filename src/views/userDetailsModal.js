export const userDetailsModal = async (store) => {  
    return /*html*/`
        <!-- Open the modal using ID.showModal() method -->
        <dialog id="userDetailsModal" class="modal">
            <form method="dialog" class="modal-box">
                <h3 class="font-bold text-lg">Hello!</h3>
                <p class="py-4">Press ESC key or click the button below to close</p>
                <div class="modal-action">
                    <!-- if there is a button in form, it will close the modal -->
                    <button class="btn">Close</button>
                </div>
            </form>
        </dialog>
        <script>
            if (window.location.search) {
                const params = new URL(document.location).searchParams;
                const trigger = params.get("triggerFragment");
                if (trigger == "userDetailsModal") {
                    const modal = document.getElementById('userDetailsModal');
                    modal.showModal();
                    console.log(document.cookie)
                }
            }

        </script>

`
}