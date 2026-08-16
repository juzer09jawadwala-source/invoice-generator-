FILES_UI="src/components/Dashboard.tsx src/components/Editor.tsx src/components/InvoiceBuilder.tsx src/App.tsx src/index.css"

for f in $FILES_UI; do
  sed -i 's/\[#38BDF8\]/\[#3B82F6\]/g' $f
  sed -i 's/\[#0284C7\]/\[#2563EB\]/g' $f
  sed -i 's/\[#0B1120\]/\[#09090B\]/g' $f
  sed -i 's/\[#0F172A\]/\[#18181B\]/g' $f
  sed -i 's/\[#1E293B\]/\[#27272A\]/g' $f
  sed -i 's/\[#334155\]/\[#3F3F46\]/g' $f
  sed -i 's/\[#FFFFFF\]/\[#FAFAFA\]/g' $f
  sed -i 's/\[#94A3B8\]/\[#A1A1AA\]/g' $f
  sed -i 's/text-\[#0F172A\]/text-\[#18181B\]/g' $f
done

sed -i 's/\[#38BDF8\]/\[#3B82F6\]/g' src/components/InvoicePreview.tsx

