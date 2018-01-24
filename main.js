function onPageLoad()
{
	const navbar = document.getElementById("navbar");
	const navButtons = navbar.querySelectorAll("[data-sectionlink]");

	for (let button of navButtons)
	{
		button.onclick = (evt) => {
			const sectionId = button.getAttribute("data-sectionlink");
			const targetPane = document.getElementById("pane-" + sectionId);
			const navBarHeight = navbar.offsetHeight;
			document.body.scrollTop = targetPane.offsetTop - navBarHeight;
		};
	}

	const aboutHeader = document.querySelector("#pane-about > h1");
	const incomingHeader = aboutHeader.cloneNode(true);
	incomingHeader.classList.add("floating-section-header");
	document.body.appendChild(incomingHeader);

	window.onscroll = () => {
		incomingHeader.textContent = getFloatingSectionHeaderText();
		//getFloatingSectionHeaderPosition();

		const aboutHeader = document.querySelector("#pane-about > h1");
		const aboutHeaderRect = aboutHeader.getBoundingClientRect();
		incomingHeader.style.left = aboutHeaderRect.left + "px";
		incomingHeader.style.top = Math.max(0, aboutHeaderRect.top) + "px";
	};
}

function getFloatingSectionHeaderText()
{
	return "About";
}