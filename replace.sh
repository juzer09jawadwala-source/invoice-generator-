FILES_UI="src/components/Dashboard.tsx src/components/Editor.tsx src/components/InvoiceBuilder.tsx src/App.tsx src/index.css"

for f in $FILES_UI; do
  sed -i 's/\[#2563EB\]/\[#38BDF8\]/g' $f
  sed -i 's/\[#1D4ED8\]/\[#0284C7\]/g' $f
  sed -i 's/\[#F9FAFB\]/\[#0B1120\]/g' $f
  sed -i 's/\[#FFFFFF\]/\[#0F172A\]/g' $f
  sed -i 's/\[#E5E7EB\]/\[#1E293B\]/g' $f
  sed -i 's/\[#D1D5DB\]/\[#334155\]/g' $f
  sed -i 's/\[#111111\]/\[#FFFFFF\]/g' $f
  sed -i 's/\[#6B7280\]/\[#94A3B8\]/g' $f
done

sed -i 's/\[#2563EB\]/\[#38BDF8\]/g' src/components/InvoicePreview.tsx
sed -i 's/text-white/text-\[#0F172A\]/g' src/components/Dashboard.tsx src/components/Editor.tsx
