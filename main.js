var incomingHeader;
var outgoingHeader;
var navbarCurUnderline;
var navbarPrevUnderline;

function onPageLoad()
{
	const navbar = document.getElementById("navbar");
	const navButtons = navbar.querySelectorAll("[data-sectionlink]");

	for (let button of navButtons)
	{
		button.onclick = (evt) => {
			const sectionId = button.getAttribute("data-sectionlink");

			if (sectionId === "home")
			{
				scrollToElement(document.body);				
				return;
			}

			const target = document.querySelector("#pane-" + sectionId + " > .pane-title");
			scrollToElement(target);
		};
	}

	navbarCurUnderline = document.createElement("div");
	navbarCurUnderline.className = "navbar-underline";
	navbar.appendChild(navbarCurUnderline);
	navbarPrevUnderline = document.createElement("div");
	navbarPrevUnderline.className = "navbar-underline";
	navbar.appendChild(navbarPrevUnderline);

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
		renderNavbarUnderlines();
	};
}

function renderNavbarUnderlines()
{
	const prevPane = getPreviousPane();
	const curPane = getCurrentPane();


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

		const outgoingHeaderOpacity = Math.min(1, (incomingHeaderRect.top - outgoingHeaderRect.top) / 100);
		outgoingHeader.style.opacity = outgoingHeaderOpacity + "";
		outgoingHeader.style.display = "";

		// Update navbar line positions and opacities
		navbarPrevUnderline.style.opacity = outgoingHeaderOpacity + "";
		navbarCurUnderline.style.opacity = 1 - outgoingHeaderOpacity + "";

		const prevNavButton = navbar.querySelector("[data-sectionlink=" + prevPane.id.substr(5) + "]");

		if (prevNavButton)
		{
			const prevNavButtonRect = prevNavButton.getBoundingClientRect();
			navbarPrevUnderline.style.left = prevNavButtonRect.left;
			navbarPrevUnderline.style.width = prevNavButtonRect.width;
		}

		const curNavButton = navbar.querySelector("[data-sectionlink=" + curPane.id.substr(5) + "]");
		const curNavButtonRect = curNavButton.getBoundingClientRect();
		navbarCurUnderline.style.left = curNavButtonRect.left;
		navbarCurUnderline.style.width = curNavButtonRect.width;
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

function scrollToElement(target)
{
	//document.body.scrollTop = target.offsetTop;
	const scrollTopInit = document.body.scrollTop;
	const distance = target.offsetTop - document.body.scrollTop;
	const duration = 1000; // 1s

	let lastTimestamp = null;
	let t = 0;

	let doScroll = (timestamp) =>
	{
		lastTimestamp = lastTimestamp || timestamp;
		
		let dt = timestamp - lastTimestamp;

		if (distance > 0)
			document.body.scrollTop = Math.min(target.offsetTop, scrollTopInit + (t / 1000 * distance));
		else
			document.body.scrollTop = Math.max(target.offsetTop, scrollTopInit + (t / 1000 * distance));
		
		t += dt;
		
		if ((distance > 0 && document.body.scrollTop < target.offsetTop) ||
			(distance < 0 && document.body.scrollTop > target.offsetTop))
			requestAnimationFrame(doScroll);
		
		lastTimestamp = timestamp;
	}

	requestAnimationFrame(doScroll);
}
