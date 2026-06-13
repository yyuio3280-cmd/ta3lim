// تعيين المسار الافتراضي للمكتبة لتستطيع معالجة الملفات في الخلفية
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

// الدالة الرئيسية لجلب ملف الـ PDF وحفظه كصور في الصفحة
function loadSubjectPDF(subjectName) {
    const container = document.getElementById('pdfContainer');
    const loadingStatus = document.getElementById('loadingStatus');
    
    // تنظيف الحاوية من أي درس قديم تم عرضه
    container.innerHTML = '';
    // إظهار نص جاري التحميل
    loadingStatus.style.display = 'block';

    // تركيب مسار الملف تلقائياً بناءً على اسم المادة المحدد في الزر
    // مثال: pdf_source/arabic.pdf أو pdf_source/math.pdf
    const pdfUrl = `pdf_source/${subjectName}.pdf`;

    // بدء جلب وقراءة ملف الـ PDF
    pdfjsLib.getDocument(pdfUrl).promise.then(pdf => {
        // إخفاء نص التحميل بعد نجاح الاتصال بالملف
        loadingStatus.style.display = 'none';
        
        // حلقة تكرارية لمرور على جميع صفحات الـ PDF صفحة بصفحة
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            
            // إنشاء عنصر Canvas مخصص لكل صفحة ليعمل كـ "صورة"
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-page-image';
            container.appendChild(canvas);
            
            const context = canvas.getContext('2d');

            // قراءة الصفحة الحالية
            pdf.getPage(pageNum).then(page => {
                // ضبط جودة وحجم الصورة (1.5 تعني جودة ممتازة وواضحة جداً للقراءة)
                const viewport = page.getViewport({ scale: 1.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // رندرة (Render) صفحة الـ PDF وتحويلها إلى صورة داخل الـ Canvas
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }
    }).catch(error => {
        // في حال عدم وجود الملف أو حدوث خطأ في التسمية
        loadingStatus.style.display = 'none';
        container.innerHTML = `<p class="error-msg">❌ عذراً، لم يتم العثور على ملف مادة الـ PDF المسمى بـ (${subjectName}.pdf) داخل مجلد pdf_source.</p>`;
        console.error("خطأ في جلب الملف:", error);
    });

    // تحديث شكل الأزرار النشطة
    updateActiveButton();
}

// دالة لتغيير تصميم الزر المختار ليصبح مظللاً
function updateActiveButton() {
    let buttons = document.getElementsByClassName('tab-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
    }
    if (event && event.target) {
        event.target.classList.add('active');
    }
}
