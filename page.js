await new Promise((r) => (window.onload = () => r(1)));
//enable popover via bootstrap.
const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
);
const popoverList = [...popoverTriggerList].map(
    (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
);
const avatarImgWrap = document.querySelector(".avatarImgWrap");

const defaultImgCss = {
    "object-fit": "cover",
    "object-position": "top",
    "background-color": "#fff",
};
const imgElm = avatarImgWrap.querySelector("img");
// Apply default CSS to avatar image
$(imgElm).css(defaultImgCss);

const popoverContent = document.createElement("div");
popoverContent.innerHTML = `
				<input type="file" id="avatarImgInput" accept="image/*" class="form-control mb-2" />
				<label for="popoverInput">이미지의 CSS 속성 입력</label>
				<textarea id="popoverInput" rows="4" style="width: 100%;" placeholder='${JSON.stringify(
    defaultImgCss,
    null,
    2
)}'></textarea>
				<button id="popoverSave" class="btn btn-primary btn-sm mt-2">Save</button>
				<p class="mt-2 mb-0">이미지를 다시 클릭하면 이창은 닫아집니다.</p>
			`;

const popover = new bootstrap.Popover(avatarImgWrap, {
    content: popoverContent,
    trigger: "focus",
    html: true,
    placement: "right",
});

// Show popover when clicking avatar image
avatarImgWrap.addEventListener("click", (e) => {
    popover.toggle();
});
document.addEventListener("change", (e) => {
    if (e.target && e.target.id === "avatarImgInput") {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                imgElm.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
});
// Handle save button click inside popover
document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "popoverSave") {
        const input = document.getElementById("popoverInput").value;
        if (!input) return;
        try {
            const jsonData = JSON.parse(input);
            console.log("Parsed JSON:", jsonData);
            $(imgElm).css(jsonData);
            popover.hide();
        } catch (error) {
            alert("Invalid JSON format. Please try again.");
        }
    }
    if (e.target && e.target.id === "downloadBtn") {
        const elm = document.querySelector(".main-section");
        window.domtoimage.toBlob(elm)
            .then(function (blob) {
                // FileSaver를 사용하여 변환된 Blob을 파일로 저장
                window.saveAs(blob, 'myMikuCard.png');
            })
            .catch(function (error) {
                console.error('이미지 생성 실패:', error);
            });
    }
});