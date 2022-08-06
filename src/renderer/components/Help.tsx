type HelpProps = {
  onBrowseFileClick: () => void;
};

export default function Help({ onBrowseFileClick }: HelpProps) {
  return (
    <div className="help">
      <header>drop image</header>
      <span> OR </span>
      <button type="button" onClick={onBrowseFileClick}>
        browse image
      </button>
      <section>
        <div>
          <span>zoom</span>
          <span> — / + </span>
        </div>
        <div>
          <span>opacity</span>
          <span> 0 — 9 </span>
        </div>
        <div>
          <span>move</span>
          <span> {'< ^ >'} </span>
        </div>
        <div>
          <span>reset</span>
          <span> R </span>
        </div>
      </section>
    </div>
  );
}
