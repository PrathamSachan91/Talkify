const Footer = () => {
  return (
    <footer className="h-10 bg-slate-900 text-gray-400 flex items-center justify-center text-sm">
      © {new Date().getFullYear()} Talkify. All rights reserved.
    </footer>
  );
};

export default Footer;
