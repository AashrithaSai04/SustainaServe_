import torch
import torch.nn as nn
import torchvision.models as models

class MultimodalModel(nn.Module):
    def __init__(self, metadata_dim=2, num_classes=2):
        super(MultimodalModel, self).__init__()
        
        # Pretrained ResNet backbone
        resnet = models.resnet18(pretrained=False)  # pretrained=False to match training
        modules = list(resnet.children())[:-1]  # remove the classifier
        self.image_model = nn.Sequential(*modules)
        self.img_fc = nn.Linear(resnet.fc.in_features, 128)
        
        # Metadata branch
        self.metadata_fc = nn.Sequential(
            nn.Linear(metadata_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 32),
            nn.ReLU()
        )
        
        # Combined classifier
        self.classifier = nn.Sequential(
            nn.Linear(128 + 32, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )

    def forward(self, image, metadata):
        img_feat = self.image_model(image).squeeze(-1).squeeze(-1)  # (batch, 512)
        img_feat = self.img_fc(img_feat)
        
        meta_feat = self.metadata_fc(metadata)
        
        combined = torch.cat([img_feat, meta_feat], dim=1)
        out = self.classifier(combined)
        return out
