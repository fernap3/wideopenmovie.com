class App
{
	private incomingHeader: HTMLElement;
	private outgoingHeader: HTMLElement;
	private navbarUnderline: HTMLElement;
	private navbar: HTMLElement;
	private navbarFixed: boolean;

	constructor()
	{
		this.navbar = document.getElementById("navbar");
		const navButtons = this.navbar.querySelectorAll("[data-sectionlink]") as NodeListOf<HTMLButtonElement>;

		for (let button of navButtons)
		{
			button.onclick = (evt) => {
				const sectionId = button.getAttribute("data-sectionlink");

				if (sectionId === "home")
				{
					this.ScrollToElement(document.body);				
					return;
				}

				const target = document.querySelector("#pane-" + sectionId + " > .pane-title") as HTMLElement;
				this.ScrollToElement(target);
			};
		}

		this.navbarUnderline = document.createElement("div");
		this.navbarUnderline.className = "navbar-underline";
		this.navbar.appendChild(this.navbarUnderline);

		const moreInfoButton = document.querySelector(".moreinfo-button") as HTMLButtonElement;
		moreInfoButton.onclick = e => this.ScrollToElement(document.querySelector(".pane-title"));

		const aboutHeader = document.querySelector("#pane-about > h1");
		this.incomingHeader = aboutHeader.cloneNode(true) as HTMLElement;
		this.incomingHeader.classList.add("floating-section-header");
		this.outgoingHeader = aboutHeader.cloneNode(true) as HTMLElement;
		this.outgoingHeader.classList.add("floating-section-header");
		document.body.appendChild(this.incomingHeader);
		document.body.appendChild(this.outgoingHeader);

		window.onscroll = () => this.UpdatePageState();
		window.onresize = () => this.UpdatePageState();
		this.UpdatePageState();
	}

	private UpdatePageState()
	{
		const navbarFixed = this.navbar.getBoundingClientRect().top <= 0;
		if (this.navbarFixed === null || navbarFixed !== this.navbarFixed)
		{
			this.navbarFixed = navbarFixed;
			if (navbarFixed)
				document.body.classList.add("navbar-fixed");
			else
				document.body.classList.remove("navbar-fixed");
		}
		
		this.RenderIncomingHeader();
		this.RenderOutgoingHeader();
		this.RenderNavbarUnderline();
	}

	private RenderNavbarUnderline()
	{
		const curPane = this.GetCurrentPane();
		const curNavButton = this.navbar.querySelector("[data-sectionlink=" + curPane.id.substr(5) + "]");
		const curNavButtonRect = curNavButton.getBoundingClientRect();
		const lineWidth = curNavButtonRect.width - 10;
		
		this.navbarUnderline.style.left = curNavButtonRect.left + (curNavButtonRect.width / 2) - (lineWidth / 2) + "px";
		this.navbarUnderline.style.width = lineWidth + "px";
	}

	private RenderOutgoingHeader()
	{
		const prevPane = this.GetPreviousPane();
		const curPane = this.GetCurrentPane();
		if (prevPane && prevPane.id !== "pane-home")
		{
			const prevPaneHeader = prevPane.querySelector(".pane-title") as HTMLElement;
			const paneTitle = prevPaneHeader.textContent;
			const paneTitleRect = prevPaneHeader.getBoundingClientRect();
			this.outgoingHeader.style.left = paneTitleRect.left + "px";
			this.outgoingHeader.style.top = this.navbar.offsetHeight / 2 - prevPaneHeader.offsetHeight / 2 + "px";
			this.outgoingHeader.textContent = paneTitle;

			const incomingHeaderRect = this.incomingHeader.getBoundingClientRect();
			const outgoingHeaderRect = this.outgoingHeader.getBoundingClientRect();

			const outgoingHeaderOpacity = Math.min(1, (incomingHeaderRect.top - outgoingHeaderRect.top) / 100);
			this.outgoingHeader.style.opacity = outgoingHeaderOpacity + "";
			this.outgoingHeader.style.display = "";
		}
		else
		{
			this.outgoingHeader.style.display = "none";
		}
	}

	private RenderIncomingHeader()
	{
		const currentPane = this.GetCurrentPane();
		if (currentPane && currentPane.id !== "pane-home")
		{
			const paneHeader = currentPane.querySelector(".pane-title") as HTMLElement;
			const paneTitle = paneHeader.textContent;
			const paneTitleRect = paneHeader.getBoundingClientRect();
			this.incomingHeader.style.left = paneTitleRect.left + "px";
			this.incomingHeader.style.top = Math.max(this.navbar.offsetHeight / 2 - paneHeader.offsetHeight / 2, paneTitleRect.top) + "px";
			this.incomingHeader.textContent = paneTitle;
			this.incomingHeader.style.display = "";
		}
		else
		{
			this.incomingHeader.style.display = "none";
		}
	}

	private GetPreviousPane()
	{
		const panes = Array.from(document.querySelectorAll(".pane"));
		const currentPane = this.GetCurrentPane();

		for (let i = 0; i < panes.length - 1; i++)
		{
			if (panes[i + 1] === currentPane)
				return panes[i];
		}
	}

	private GetCurrentPane()
	{
		const panes = Array.from(document.querySelectorAll(".pane")).reverse();

		for (let pane of panes)
		{
			if (this.IsScrolledPastPane(pane as HTMLElement))
				return pane;
		}
	}

	private IsScrolledPastPane(pane: HTMLElement)
	{
		const navbar = document.getElementById("navbar");
		const paneBounds = pane.getBoundingClientRect();
		return paneBounds.top <= navbar.offsetHeight;
	}

	private ScrollToElement(target: HTMLElement)
	{
		const scrollTopInit = document.body.scrollTop;
		let distance = target.offsetTop - document.body.scrollTop;

		// If the screen is less than 600px wide, then the pane headers don't
		// dock to the navbar and we need to let the static headers show on the
		// page without scrolling under the navbar.
		if (!window.matchMedia("screen and (min-width: 600px)").matches)
			distance -= this.navbar.offsetHeight;

		const duration = 600; // in milliseconds

		let startTime: number = null;
		let bezier = new CubicBezier(0, .75, .95, 1);

		let doScroll = (timestamp: number) =>
		{
			startTime = startTime || timestamp;

			const t = Math.min(1, (timestamp - startTime) / duration);
			let newPosition = scrollTopInit + (bezier.Solve(t) * distance);

			document.body.scrollTop = newPosition;

			if (t < 1)
				requestAnimationFrame(doScroll);
		}

		requestAnimationFrame(doScroll);
	}
}

class CubicBezier
{
	constructor(private x0: number, private y0: number, private x1: number, private y1: number)
	{
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
	}

	/** Returns the y-coordinate of the bezier curve at time t [0,1] */
	Solve(t: number)
	{
		if (t < 0 || t > 1)
			throw "t must be between 0 and 1 inclusive";
		
		return (this.x0 * ((1 - t) ** 3)) +
			   (3 * this.y0 * ((1 - t)**2) * t) + 
			   (3 * this.x1 * (1 - t) * (t**2)) + 
			   (this.y1 * (t**3));
	}
}