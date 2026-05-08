export function Footer() {
  return (
    <footer className="max-w-5xl mx-auto mt-24 py-8 border-t border-glass-borderSubtle text-xs text-fg-muted">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <span className="text-accent-green">julien.lerosty</span>
          <span>{"//"}</span>
          <a
            href="https://github.com/julienlerosty"
            className="hover:text-accent-green transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            github
          </a>
          <span>{"//"}</span>
          <a
            href="https://linkedin.com/in/julienlerosty"
            className="hover:text-accent-green transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            linkedin
          </a>
          <span>{"//"}</span>
          <a
            href="mailto:julien.lerosty@gmail.com"
            className="hover:text-accent-green transition-colors"
          >
            email
          </a>
          <span>{"//"}</span>
          <a
            href="/work"
            className="hover:text-accent-green transition-colors"
          >
            work
          </a>
          <span>{"//"}</span>
          <a
            href="/resume/julien-lerosty-ai-engineer.pdf"
            className="hover:text-accent-green transition-colors"
          >
            resume
          </a>
        </div>
        <div className="text-fg-subtle">last updated by an autonomous agent</div>
      </div>
    </footer>
  );
}
