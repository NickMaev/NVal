function init() {
    var elForm = document.getElementById("form");
    var nval = new NVal.NVal(elForm);
	window.nval = nval;
	var btn = document.getElementById("submitBtn");
	btn.addEventListener("click", function(e){
		e.preventDefault();
		if(nval.isValid()){
			alert("Form is valid.")
		}
	});
}