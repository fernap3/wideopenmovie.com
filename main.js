var incomingHeader;
var outgoingHeader;

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
	incomingHeader = aboutHeader.cloneNode(true);
	incomingHeader.classList.add("floating-section-header");
	outgoingHeader = aboutHeader.cloneNode(true);
	outgoingHeader.classList.add("floating-section-header");
	document.body.appendChild(incomingHeader);
	document.body.appendChild(outgoingHeader);

	window.onscroll = () =>
	{
		renderIncomingHeader();
		renderOutgoingHeader();
	};
}

function renderOutgoingHeader()
{
	const prevPane = getPreviousPane();
	const curPane = getCurrentPane();
	if (prevPane && prevPane.id !== "pane-home")
	{
		const prevPaneHeader = prevPane.querySelector(".pane-title");
		const paneTitle = prevPaneHeader.textContent;
		const paneTitleRect = prevPaneHeader.getBoundingClientRect();
		outgoingHeader.style.left = paneTitleRect.left + "px";
		outgoingHeader.style.top = navbar.offsetHeight / 2 - prevPaneHeader.offsetHeight / 2 + "px";
		outgoingHeader.textContent = paneTitle;

		const incomingHeaderRect = incomingHeader.getBoundingClientRect();
		const outgoingHeaderRect = outgoingHeader.getBoundingClientRect();

		outgoingHeader.style.opacity = Math.min(1, (incomingHeaderRect.top - outgoingHeaderRect.top) / 100) + "";

		outgoingHeader.style.display = "";
	}
	else
	{
		outgoingHeader.style.display = "none";
	}
}

function renderIncomingHeader()
{
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
}

function getPreviousPane()
{
	const panes = Array.from(document.querySelectorAll(".pane"));
	const currentPane = getCurrentPane();

	for (let i = 0; i < panes.length - 1; i++)
	{
		if (panes[i + 1] === currentPane)
			return panes[i];
	}
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
