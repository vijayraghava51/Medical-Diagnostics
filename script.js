document.addEventListener('DOMContentLoaded', function() {
    // Global state
    const appState = {
        currentPage: 'home',
        datasetLoaded: false,
        modelLoaded: false,
        modelTrained: false,
        modelEvaluated: false,
        trainingHistory: null,
        evaluationResults: null,
        activeModelType: 'random-forest',
        uploadedImage: null,
        usingSample: false
    };

    // DOM Elements
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
    const loadDatasetBtn = document.getElementById('load-dataset-btn');
    const modelTypeSelect = document.getElementById('model-type');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const trainModelBtn = document.getElementById('train-model-btn');
    const loadPretrainedBtn = document.getElementById('load-pretrained-btn');
    const evaluateModelBtn = document.getElementById('evaluate-model-btn');
    const uploadBox = document.getElementById('upload-box');
    const fileUpload = document.getElementById('file-upload');
    const useSampleCheckbox = document.getElementById('use-sample');
    const cancelPreviewBtn = document.getElementById('cancel-preview-btn');
    const analyzeBtn = document.getElementById('analyze-btn');
    const sliders = document.querySelectorAll('.slider');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    
    // Initialize page navigation
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.getAttribute('data-page');
            navigateToPage(pageId);
        });
    });
    
    // Initialize tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            activateTab(tab, tabId);
        });
    });
    
    // Initialize help modal
    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'flex';
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            helpModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
    
    // Initialize accordions
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });
    
    // Initialize sliders
    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        valueDisplay.textContent = slider.value;
        
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
    });
    
    // Model type selection
    if (modelTypeSelect) {
        modelTypeSelect.addEventListener('change', () => {
            const selectedType = modelTypeSelect.value;
            appState.activeModelType = selectedType;
            
            // Update model description visibility
            document.querySelectorAll('.model-description-content').forEach(desc => {
                desc.style.display = 'none';
            });
            
            document.querySelector(`.model-description-content.${selectedType}`).style.display = 'block';
        });
    }
    
    // Load dataset button
    if (loadDatasetBtn) {
        loadDatasetBtn.addEventListener('click', async () => {
            showLoading('Loading dataset...');
            
            // Simulate dataset loading
            await simulateAsyncOperation(2000);
            
            appState.datasetLoaded = true;
            updateUIState();
            
            hideLoading();
            showNotification('Dataset loaded successfully!', 'success');
            
            // Show dataset content and update status
            document.querySelector('.dataset-status').classList.remove('not-loaded');
            document.querySelector('.dataset-status').classList.add('loaded');
            document.querySelector('.dataset-status').innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Dataset Status: Loaded and ready for use</span>';
            
            // Hide warning and show content in explore tab
            document.querySelector('.dataset-warning').style.display = 'none';
            document.querySelector('.dataset-content').style.display = 'block';
            
            // Initialize class distribution chart
            initializeClassDistributionChart();
            
            // Update training page visibility
            document.querySelector('#training .dataset-warning').style.display = 'none';
            document.querySelector('.training-content').style.display = 'block';
        });
    }
    
    // Train model button
    if (trainModelBtn) {
        trainModelBtn.addEventListener('click', async () => {
            if (!appState.datasetLoaded) {
                showNotification('Please load the dataset first!', 'error');
                return;
            }
            
            // Get training parameters
            const epochs = document.getElementById('epochs').value;
            const batchSize = document.getElementById('batch-size').value;
            const learningRate = document.getElementById('learning-rate').value;
            const dropoutRate = document.getElementById('dropout').value;
            
            // Show training progress
            document.querySelector('.training-progress').style.display = 'block';
            const progressBar = document.querySelector('.progress-bar');
            const progressStatus = document.querySelector('.progress-status');
            
            progressStatus.textContent = 'Preparing model for training...';
            progressBar.style.width = '0%';
            
            // Simulate training process
            for (let i = 1; i <= epochs; i++) {
                progressStatus.textContent = `Training epoch ${i}/${epochs}...`;
                progressBar.style.width = `${(i / epochs) * 100}%`;
                await simulateAsyncOperation(500);
            }
            
            // Complete training
            progressBar.style.width = '100%';
            progressStatus.textContent = 'Model training complete!';
            
            // Update state
            appState.modelLoaded = true;
            appState.modelTrained = true;
            
            // Create fake training history
            appState.trainingHistory = {
                accuracy: [0.7, 0.75, 0.8, 0.83, 0.85],
                val_accuracy: [0.65, 0.7, 0.72, 0.75, 0.78],
                loss: [0.5, 0.4, 0.35, 0.3, 0.25],
                val_loss: [0.6, 0.5, 0.45, 0.4, 0.35]
            };
            
            // Update UI
            updateUIState();
            await simulateAsyncOperation(1000);
            showNotification('Model trained successfully!', 'success');
            
            // Update model status
            document.querySelector('.model-status').classList.remove('not-loaded');
            document.querySelector('.model-status').classList.add('loaded');
            document.querySelector('.model-status').innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Model Status: Ready for evaluation and prediction</span>';
            
            // Show evaluation and prediction content
            document.querySelector('#evaluation .model-warning').style.display = 'none';
            document.querySelector('.evaluation-content').style.display = 'block';
            document.querySelector('#prediction .model-warning').style.display = 'none';
            document.querySelector('.prediction-content').style.display = 'block';
        });
    }
    
    // Load pre-trained model button
    if (loadPretrainedBtn) {
        loadPretrainedBtn.addEventListener('click', async () => {
            showLoading('Loading pre-trained model...');
            
            // Simulate loading
            await simulateAsyncOperation(2000);
            
            // Update state
            appState.modelLoaded = true;
            appState.modelTrained = true;
            
            // Create fake training history
            appState.trainingHistory = {
                accuracy: [0.7, 0.8, 0.85, 0.88, 0.9],
                val_accuracy: [0.65, 0.75, 0.78, 0.8, 0.82],
                loss: [0.6, 0.4, 0.3, 0.25, 0.2],
                val_loss: [0.7, 0.5, 0.4, 0.35, 0.3]
            };
            
            // Update UI
            updateUIState();
            
            hideLoading();
            showNotification('Pre-trained model loaded successfully!', 'success');
            
            // Update model status
            document.querySelector('.model-status').classList.remove('not-loaded');
            document.querySelector('.model-status').classList.add('loaded');
            document.querySelector('.model-status').innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Model Status: Ready for evaluation and prediction</span>';
            
            // Show evaluation and prediction content
            document.querySelector('#evaluation .model-warning').style.display = 'none';
            document.querySelector('.evaluation-content').style.display = 'block';
            document.querySelector('#prediction .model-warning').style.display = 'none';
            document.querySelector('.prediction-content').style.display = 'block';
            
            // Initialize charts
            if (document.getElementById('training-history-chart')) {
                initializeTrainingHistoryChart();
            }
        });
    }
    
    // Evaluate model button
    if (evaluateModelBtn) {
        evaluateModelBtn.addEventListener('click', async () => {
            if (!appState.modelTrained) {
                showNotification('Please train a model first!', 'error');
                return;
            }
            
            showLoading('Evaluating model on test data...');
            
            // Simulate evaluation
            await simulateAsyncOperation(3000);
            
            // Generate fake evaluation results
            appState.evaluationResults = {
                accuracy: 0.87,
                precision: 0.85,
                recall: 0.89,
                f1_score: 0.87,
                confusion_matrix: [
                    [450, 50],
                    [100, 400]
                ],
                y_true: Array(1000).fill(0).map(() => Math.round(Math.random())),
                y_pred_proba: Array(1000).fill(0).map(() => Math.random())
            };
            
            // Calculate additional metrics
            const tn = appState.evaluationResults.confusion_matrix[0][0];
            const fp = appState.evaluationResults.confusion_matrix[0][1];
            const fn = appState.evaluationResults.confusion_matrix[1][0];
            const tp = appState.evaluationResults.confusion_matrix[1][1];
            
            const sensitivity = tp / (tp + fn);
            const specificity = tn / (tn + fp);
            const ppv = tp / (tp + fp);
            const npv = tn / (tn + fn);
            
            // Update UI with results
            document.getElementById('accuracy-value').textContent = `${(appState.evaluationResults.accuracy * 100).toFixed(2)}%`;
            document.getElementById('precision-value').textContent = `${(appState.evaluationResults.precision * 100).toFixed(2)}%`;
            document.getElementById('recall-value').textContent = `${(appState.evaluationResults.recall * 100).toFixed(2)}%`;
            document.getElementById('f1-value').textContent = `${(appState.evaluationResults.f1_score * 100).toFixed(2)}%`;
            
            document.getElementById('sensitivity-value').textContent = `${(sensitivity * 100).toFixed(2)}%`;
            document.getElementById('specificity-value').textContent = `${(specificity * 100).toFixed(2)}%`;
            document.getElementById('ppv-value').textContent = `${(ppv * 100).toFixed(2)}%`;
            document.getElementById('npv-value').textContent = `${(npv * 100).toFixed(2)}%`;
            
            // Show evaluation results
            document.querySelector('.evaluation-results').style.display = 'block';
            
            // Initialize charts
            initializeConfusionMatrixChart();
            initializeTrainingHistoryChart();
            initializeROCCurveChart();
            
            appState.modelEvaluated = true;
            updateUIState();
            
            hideLoading();
            showNotification('Model evaluation complete!', 'success');
        });
    }
    
    // Image upload handling
    if (uploadBox && fileUpload) {
        // Drag and drop handling
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('drag-over');
        });
        
        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('drag-over');
        });
        
        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length) {
                handleImageUpload(e.dataTransfer.files[0]);
            }
        });
        
        uploadBox.addEventListener('click', () => {
            fileUpload.click();
        });
        
        fileUpload.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleImageUpload(e.target.files[0]);
            }
        });
    }
    
    // Use sample checkbox
    if (useSampleCheckbox) {
        useSampleCheckbox.addEventListener('change', () => {
            if (useSampleCheckbox.checked) {
                // Simulate loading a sample image
                appState.usingSample = true;
                appState.uploadedImage = null;
                
                // Show preview with sample image
                document.querySelector('.preview-container').style.display = 'block';
                document.querySelector('.upload-container').style.display = 'none';
                document.querySelector('.examples-container').style.display = 'none';
                
                const previewImg = document.getElementById('preview-img');
                previewImg.src = "https://cdn.pixabay.com/photo/2020/09/08/15/20/x-ray-5555703_960_720.jpg";
                
                // Update preview header
                document.querySelector('.preview-header h3').textContent = 'Sample X-ray Image';
            } else {
                appState.usingSample = false;
                
                // Hide preview if no uploaded image
                if (!appState.uploadedImage) {
                    document.querySelector('.preview-container').style.display = 'none';
                    document.querySelector('.upload-container').style.display = 'block';
                    document.querySelector('.examples-container').style.display = 'block';
                }
            }
        });
    }
    
    // Cancel preview button
    if (cancelPreviewBtn) {
        cancelPreviewBtn.addEventListener('click', () => {
            document.querySelector('.preview-container').style.display = 'none';
            document.querySelector('.upload-container').style.display = 'block';
            document.querySelector('.examples-container').style.display = 'block';
            
            // Reset state
            appState.uploadedImage = null;
            appState.usingSample = false;
            useSampleCheckbox.checked = false;
            
            // Hide analysis results if visible
            document.querySelector('.analysis-results').style.display = 'none';
        });
    }
    
    // Analyze image button
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', async () => {
            if (!appState.modelTrained) {
                showNotification('Please train a model first!', 'error');
                return;
            }
            
            showLoading('Analyzing image...');
            
            // Simulate analysis
            await simulateAsyncOperation(1000);
            loadingText.textContent = 'Processing image...';
            await simulateAsyncOperation(1000);
            loadingText.textContent = 'Running model prediction...';
            await simulateAsyncOperation(1000);
            
            // Generate random prediction (in a real app, this would come from the backend)
            const isPneumonia = Math.random() > 0.5;
            const confidenceScore = 0.5 + (Math.random() * 0.4); // Between 0.5 and 0.9
            
            // Update UI with results
            const predictionResult = document.getElementById('prediction-result');
            const confidenceValue = document.getElementById('confidence-value');
            const confidenceBar = document.getElementById('confidence-bar');
            const confidenceText = document.getElementById('confidence-text');
            const resultsHeader = document.getElementById('results-header');
            const resultsBody = document.getElementById('results-body');
            const analysisFindings = document.getElementById('analysis-findings');
            
            // Set prediction
            predictionResult.textContent = isPneumonia ? 'Pneumonia' : 'Normal';
            
            // Set header color
            resultsHeader.className = 'results-header';
            resultsHeader.classList.add(isPneumonia ? 'pneumonia' : 'normal');
            
            // Set body color
            resultsBody.className = 'results-body';
            resultsBody.classList.add(isPneumonia ? 'pneumonia' : 'normal');
            
            // Set confidence
            confidenceValue.textContent = `${(confidenceScore * 100).toFixed(2)}%`;
            confidenceBar.style.width = `${confidenceScore * 100}%`;
            
            // Set confidence text
            let confidenceDescription;
            if (confidenceScore > 0.9) {
                confidenceDescription = "Very High Confidence";
            } else if (confidenceScore > 0.75) {
                confidenceDescription = "High Confidence";
            } else if (confidenceScore > 0.6) {
                confidenceDescription = "Moderate Confidence";
            } else {
                confidenceDescription = "Low Confidence";
            }
            confidenceText.textContent = `Model certainty: ${confidenceDescription}`;
            
            // Analysis findings
            analysisFindings.className = 'analysis-findings';
            if (isPneumonia) {
                analysisFindings.classList.add('pneumonia');
                analysisFindings.innerHTML = `
                    <p><strong>📌 Model Assessment:</strong> The model detected patterns consistent with pneumonia in this X-ray.</p>
                    <p><strong>Possible Findings:</strong></p>
                    <ul>
                        <li>Areas of opacity or consolidation in the lung fields</li>
                        <li>Potentially reduced lung volume</li>
                        <li>Possible infiltration patterns</li>
                    </ul>
                    <p><strong>Note:</strong> This is an automated analysis and should be confirmed by a healthcare professional.</p>
                `;
            } else {
                analysisFindings.classList.add('normal');
                analysisFindings.innerHTML = `
                    <p><strong>📌 Model Assessment:</strong> The model did not detect patterns consistent with pneumonia in this X-ray.</p>
                    <p><strong>Observations:</strong></p>
                    <ul>
                        <li>No significant areas of consolidation detected</li>
                        <li>Lung fields appear clear</li>
                        <li>No identifiable infiltrates or opacities</li>
                    </ul>
                    <p><strong>Note:</strong> This is an automated analysis and should be confirmed by a healthcare professional.</p>
                `;
            }
            
            // If using sample, show actual label
            if (appState.usingSample) {
                // Randomly determine "actual" label for sample (in a real app, this would be known)
                const actualLabel = Math.random() > 0.5 ? 'Pneumonia' : 'Normal';
                const matches = actualLabel === predictionResult.textContent;
                
                const actualLabelContainer = document.getElementById('actual-label-container');
                const actualLabelText = document.getElementById('actual-label');
                const matchText = document.getElementById('match-text');
                
                actualLabelContainer.style.display = 'block';
                actualLabelText.textContent = actualLabel;
                matchText.textContent = matches ? 'Matches' : 'Does Not Match';
                matchText.style.color = matches ? '#27ae60' : '#e74c3c';
            } else {
                document.getElementById('actual-label-container').style.display = 'none';
            }
            
            // Show probability chart
            initializeProbabilityChart(isPneumonia ? confidenceScore : 1 - confidenceScore);
            
            // Show results
            document.querySelector('.analysis-results').style.display = 'block';
            
            hideLoading();
        });
    }
    
    // Helper Functions
    
    function navigateToPage(pageId) {
        // Update navigation
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            }
        });
        
        // Update pages
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === pageId) {
                page.classList.add('active');
            }
        });
        
        appState.currentPage = pageId;
    }
    
    function activateTab(clickedTab, tabId) {
        // Get parent container to scope tab operations
        const tabContainer = clickedTab.closest('.tabs').parentElement;
        
        // Deactivate all tabs in this container
        tabContainer.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Activate clicked tab
        clickedTab.classList.add('active');
        
        // Hide all tab content in this container
        tabContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show selected tab content
        tabContainer.querySelector(`#${tabId}`).classList.add('active');
    }
    
    function handleImageUpload(file) {
        // Validate file is an image
        if (!file.type.match('image.*')) {
            showNotification('Please select an image file (JPEG, PNG, GIF).', 'error');
            return;
        }
        
        // Store file
        appState.uploadedImage = file;
        appState.usingSample = false;
        
        // Update sample checkbox
        if (useSampleCheckbox) {
            useSampleCheckbox.checked = false;
        }
        
        // Display preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('preview-img');
            previewImg.src = e.target.result;
            
            document.querySelector('.preview-container').style.display = 'block';
            document.querySelector('.upload-container').style.display = 'none';
            document.querySelector('.examples-container').style.display = 'none';
            
            // Update preview header
            document.querySelector('.preview-header h3').textContent = 'Uploaded X-ray Image';
        };
        reader.readAsDataURL(file);
    }
    
    function updateUIState() {
        // Update UI based on application state
        
        // Dataset state
        if (appState.datasetLoaded) {
            // Update any UI that depends on dataset loaded state
        }
        
        // Model state
        if (appState.modelTrained) {
            // Update any UI that depends on model trained state
        }
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Add icon based on type
        let icon;
        switch (type) {
            case 'success':
                icon = 'fa-circle-check';
                break;
            case 'error':
                icon = 'fa-circle-exclamation';
                break;
            default:
                icon = 'fa-circle-info';
        }
        
        notification.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-hide after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    async function simulateAsyncOperation(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    function showLoading(message) {
        loadingText.textContent = message || 'Processing...';
        loadingOverlay.style.display = 'flex';
    }
    
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }
    
    // Chart Initialization Functions
    
    function initializeClassDistributionChart() {
        const ctx = document.getElementById('class-distribution-chart');
        if (!ctx) return;
        
        // Class distribution data
        const data = {
            labels: ['Normal', 'Pneumonia'],
            datasets: [{
                label: 'Number of Images',
                data: [1583, 4273],
                backgroundColor: ['#3498db', '#e74c3c'],
                borderColor: ['#2980b9', '#c0392b'],
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Class Distribution in Dataset'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function initializeConfusionMatrixChart() {
        const ctx = document.getElementById('confusion-matrix-chart');
        if (!ctx || !appState.evaluationResults) return;
        
        const cm = appState.evaluationResults.confusion_matrix;
        
        // Calculate total numbers for percentages
        const total = cm[0][0] + cm[0][1] + cm[1][0] + cm[1][1];
        
        // Create a heatmap using Chart.js
        const data = {
            labels: ['Predicted Normal', 'Predicted Pneumonia'],
            datasets: [
                {
                    label: 'Actual Normal',
                    data: [cm[0][0], cm[0][1]],
                    backgroundColor: [
                        'rgba(39, 174, 96, 0.7)',  // True Negative
                        'rgba(231, 76, 60, 0.7)'   // False Positive
                    ]
                },
                {
                    label: 'Actual Pneumonia',
                    data: [cm[1][0], cm[1][1]],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.7)',  // False Negative
                        'rgba(39, 174, 96, 0.7)'   // True Positive
                    ]
                }
            ]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Confusion Matrix'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.formattedValue;
                                const percentage = (context.raw / total * 100).toFixed(1);
                                label += ` (${percentage}%)`;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true,
                        max: Math.max(...cm[0], ...cm[1]) * 1.1
                    }
                }
            }
        });
    }
    
    function initializeTrainingHistoryChart() {
        const ctx = document.getElementById('training-history-chart');
        if (!ctx || !appState.trainingHistory) return;
        
        const history = appState.trainingHistory;
        const epochs = history.accuracy.length;
        const labels = Array.from({length: epochs}, (_, i) => i + 1);
        
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Training Accuracy',
                    data: history.accuracy.map(val => val * 100),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Validation Accuracy',
                    data: history.val_accuracy.map(val => val * 100),
                    borderColor: '#2980b9',
                    backgroundColor: 'rgba(41, 128, 185, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Training Loss',
                    data: history.loss,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                },
                {
                    label: 'Validation Loss',
                    data: history.val_loss,
                    borderColor: '#c0392b',
                    backgroundColor: 'rgba(192, 57, 43, 0.1)',
                    fill: true,
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        };
        
        new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Training and Validation Metrics'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        },
                        min: 0,
                        max: 100
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Loss'
                        },
                        min: 0,
                        max: Math.max(...history.loss, ...history.val_loss) * 1.5,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    function initializeROCCurveChart() {
        const ctx = document.getElementById('roc-curve-chart');
        if (!ctx || !appState.evaluationResults) return;
        
        // Calculate ROC curve points
        const { y_true, y_pred_proba } = appState.evaluationResults;
        
        // Sort prediction probabilities and corresponding true labels
        const paired = y_true.map((v, i) => [y_pred_proba[i], v]);
        paired.sort((a, b) => b[0] - a[0]); // Sort by descending probability
        
        const sortedLabels = paired.map(pair => pair[1]);
        
        // Calculate TPR and FPR for different thresholds
        const n_pos = sortedLabels.filter(v => v === 1).length;
        const n_neg = sortedLabels.length - n_pos;
        
        let tpr = [0];
        let fpr = [0];
        let tp = 0;
        let fp = 0;
        
        // Calculate TPR and FPR at each prediction
        sortedLabels.forEach(actual => {
            if (actual === 1) {
                tp += 1;
            } else {
                fp += 1;
            }
            
            tpr.push(tp / n_pos);
            fpr.push(fp / n_neg);
        });
        
        // Calculate AUC using trapezoidal rule
        let auc = 0;
        for (let i = 1; i < fpr.length; i++) {
            auc += (fpr[i] - fpr[i - 1]) * (tpr[i] + tpr[i - 1]) / 2;
        }
        
        // Create ROC curve chart
        const data = {
            labels: fpr,
            datasets: [
                {
                    label: `ROC Curve (AUC = ${auc.toFixed(3)})`,
                    data: fpr.map((x, i) => ({ x, y: tpr[i] })),
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Random Classifier',
                    data: [
                        { x: 0, y: 0 },
                        { x: 1, y: 1 }
                    ],
                    borderColor: '#7f8c8d',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }
            ]
        };
        
        new Chart(ctx, {
            type: 'scatter',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Receiver Operating Characteristic (ROC) Curve'
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'False Positive Rate'
                        }
                    },
                    y: {
                        min: 0,
                        max: 1,
                        title: {
                            display: true,
                            text: 'True Positive Rate'
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    }
                }
            }
        });
    }
    
    function initializeProbabilityChart(pneumoniaProb) {
        const ctx = document.getElementById('probability-chart');
        if (!ctx) return;
        
        const normalProb = 1 - pneumoniaProb;
        
        const data = {
            labels: ['Normal', 'Pneumonia'],
            datasets: [{
                label: 'Probability',
                data: [normalProb, pneumoniaProb],
                backgroundColor: ['#27ae60', '#e74c3c'],
                borderColor: ['#219653', '#c0392b'],
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Class Probability Distribution'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const percentage = (context.raw * 100).toFixed(2);
                                label += `${percentage}%`;
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1,
                        ticks: {
                            callback: function(value) {
                                return (value * 100) + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: #f8f9fa;
            color: #2c3e50;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background-color: #d4edda;
            color: #155724;
        }
        
        .notification.error {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .notification i {
            margin-right: 10px;
            font-size: 1.2rem;
        }
        
        .drag-over {
            border-color: #3498db !important;
            background-color: rgba(52, 152, 219, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
});