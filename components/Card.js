export default function Card({children,noPadding}) {
  let classes = 'bg-black border border-gray-700 rounded-md mb-5';
  if (!noPadding) {
    classes += ' p-4';
  }
  return (
    <div className={classes}>
      {children}
    </div>
  );
}