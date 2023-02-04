var couponInput = document.createElement('input');
couponInput.name = "claimCode"
couponInput.defaultValue = "testCode"

var cartPrice = document.createElement('span');
cartPrice.className = "grand-total-price";
cartPrice.innerText = "$50.00";


const checkoutApplyButtonhtml = `
<span id="gcApplyButtonId" class="a-button a-button-base">
    <span  class="a-button-inner">
        <input data-testid="" class="a-button-input" type="submit" aria-labelledby="gcApplyButtonId-announce">
        <span id="gcApplyButtonId-announce" class="a-button-text" aria-hidden="true">Apply</span>
    </span>
</span>
`;


var applyButtonDiv = document.createElement('div');
applyButtonDiv.innerHTML = checkoutApplyButtonhtml;

// elemDiv.style.cssText = 'position:absolute;width:100%;height:100%;opacity:0.3;z-index:100;background:#000;';
document.body.appendChild(couponInput);
document.body.appendChild(cartPrice);
document.body.appendChild(applyButtonDiv);

document.onload = () => {
    document.getElementById("gcApplyButtonId").onclick = (a) => {
        alert("clicked")
    };
}