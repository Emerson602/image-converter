const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 5;

let selectedFiles = [];

const convertBtn = document.querySelector('#convertBtn');
const resultDiv = document.querySelector('#result');
const imagesInput = document.querySelector('#images');
const previewDiv = document.querySelector('#preview');
const errorMsg = document.querySelector('#error-msg');

const downloadModal = new bootstrap.Modal(document.querySelector("#downloadModal"));
const modalBodyDownload = document.querySelector("#modal-body-download");


function updatePreview() {
  previewDiv.innerHTML = "";
  errorMsg.textContent = "";

  if (selectedFiles.length > MAX_FILES) {
    errorMsg.textContent = `Máximo de ${MAX_FILES} imagens permitido.`;
  }

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const div = document.createElement("div");
      div.className = "thumb";

      const img = document.createElement("img");
      img.src = e.target.result;

      const btn = document.createElement("button");
      btn.className = "remove-btn";
      btn.innerHTML = "✖";
      btn.onclick = () => {
        selectedFiles.splice(index, 1);
        updatePreview();
      };

      div.appendChild(img);
      div.appendChild(btn);
      previewDiv.appendChild(div);
    };
    reader.readAsDataURL(file);
  });
}


imagesInput.addEventListener("change", () => {
  selectedFiles = Array.from(imagesInput.files);

  for (const file of selectedFiles) {
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      errorMsg.textContent = `O arquivo "${file.name}" ultrapassa ${MAX_FILE_SIZE_MB} MB.`;
      selectedFiles = [];
      imagesInput.value = "";
      updatePreview();
      return;
    }
  }

  updatePreview();
});


async function handleConvert() {
  if (selectedFiles.length === 0) {
    errorMsg.textContent = "Selecione pelo menos uma imagem.";
    return;
  }
  if (selectedFiles.length > MAX_FILES) {
    errorMsg.textContent = `Máximo de ${MAX_FILES} imagens permitido.`;
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach(file => formData.append("images", file));
  formData.append("format", document.querySelector("#format").value);

  try {
    const response = await fetch("/convert", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "imagens-convertidas.zip";
    a.textContent = "Baixar Arquivo ZIP";
    a.className = "btn btn-success";

    modalBodyDownload.innerHTML = "";
    modalBodyDownload.appendChild(a);

    downloadModal.show();

  } catch (err) {
    resultDiv.innerHTML = `<p class='text-danger'>${err.message}</p>`;
  }
}

convertBtn.addEventListener("click", handleConvert);
