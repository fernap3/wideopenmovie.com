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

	window.onscroll = () =>
	{
		incomingHeader.textContent = getFloatingSectionHeaderText();
		//getFloatingSectionHeaderPosition();

		const currentPane = getCurrentPane();

		if (currentPane && currentPane.id !== "pane-home")
		{
			const paneHeader = currentPane.querySelector(".pane-title");
			const paneTitle = paneHeader.textContent;
			const paneTitleRect = paneHeader.getBoundingClientRect();
			incomingHeader.style.left = paneTitleRect.left + "px";
			incomingHeader.style.top = Math.max(navbar.offsetHeight / 2 - paneHeader.offsetHeight / 2, paneTitleRect.top) + "px";
			incomingHeader.textContent = paneTitle;
			incomingHeader.style.display = "";
		}
		else
		{
			incomingHeader.style.display = "none";
		}


		
	};
}

function getCurrentPane()
{
	const panes = Array.from(document.querySelectorAll(".pane")).reverse();

	for (let pane of panes)
	{
		if (isScrolledPastPane(pane))
			return pane;
	}
}

function isScrolledPastPane(pane)
{
	const navbar = document.getElementById("navbar");
	const paneBounds = pane.getBoundingClientRect();
	return paneBounds.top <= navbar.offsetHeight;
}

function getIncomingHeaderTop()
{

}

function getFloatingSectionHeaderText()
{
	return "About";
}