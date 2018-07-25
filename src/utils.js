export function getIcon(row) {
  return row.icons
    ? row.icons[row.icons.length - 1].url
    : './images/ext_default_icon.png'
}
