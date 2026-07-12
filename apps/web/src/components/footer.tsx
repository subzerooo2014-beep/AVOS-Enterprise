export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <strong>AVOS</strong>
          <span>Automotive Virtual Operating System</span>
        </div>
        <p>
          © {new Date().getFullYear()} AVOS. منصة السيارات الذكية.
        </p>
      </div>
    </footer>
  );
}
