FILES_UI="src/components/Dashboard.tsx src/components/Editor.tsx src/components/InvoiceBuilder.tsx src/App.tsx src/index.css src/components/InvoicePreview.tsx"

for f in $FILES_UI; do
  sed -i 's/\[#3B82F6\]/\[#1F6F50\]/g' $f
  sed -i 's/\[#2563EB\]/\[#144A36\]/g' $f
  sed -i 's/\[#09090B\]/\[#FAFAF8\]/g' $f
  sed -i 's/\[#18181B\]/\[#FFFFFF\]/g' $f
  sed -i 's/\[#27272A\]/\[#E5E7EB\]/g' $f
  sed -i 's/\[#3F3F46\]/\[#D1D5DB\]/g' $f
  sed -i 's/\[#FAFAFA\]/\[#111111\]/g' $f
  sed -i 's/\[#A1A1AA\]/\[#6B7280\]/g' $f
done
