var submitButton = document.querySelector("button[type=submit]")

var targetNode = document.querySelector('body')

var observerOptions = {
  childList: true,
  subtree: true,
  attributes: false,
  characterData: false
};

var observer = new MutationObserver(function(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type === 'childList') {
      var addedNodes = mutation.addedNodes;
      for (var i = 0; i < addedNodes.length; i++) {
        if (addedNodes[i].classList.contains('dz-preview')) {
          submitButton.classList.remove("disabled")
          break;
        }
      }
    }
  }
});

observer.observe(targetNode, observerOptions);

const alertProcess = document.getElementById('process-started')
const appendAlert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertProcess.append(wrapper)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Dropzone.options.uploadForm = {
  init: function() {
  var myDropzone = this;
  button = this.element.querySelector("button[type=submit]")
  button.addEventListener("click", async function(e) {
      e.preventDefault();
      e.stopPropagation();
      button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="visually-hidden">Loading...</span>';
      button.classList.add("disabled");
      console.log("arrived here")
      myDropzone.processQueue();
      await sleep(2000)
      console.log("arrived here here")
      appendAlert('Process Started. It should take some time.', 'success')
  });
  }
}