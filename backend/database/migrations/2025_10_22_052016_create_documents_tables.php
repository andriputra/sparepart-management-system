<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_number')->unique();
            $table->enum('type', ['spis', 'spps', 'spqs']);
            $table->foreignId('created_by')->constrained('users');
            $table->enum('status', ['draft', 'in_progress', 'submitted', 'approved', 'rejected'])->default('draft');
            $table->json('data')->nullable();
            $table->text('preview_html')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });

        Schema::create('document_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->string('step_name');
            $table->boolean('is_completed')->default(false);
            $table->json('data')->nullable();
            $table->timestamps();
        });

        Schema::create('document_signatures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users');
            $table->string('role')->nullable();
            $table->string('signature_path')->nullable();
            $table->longText('signature_base64')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained('documents')->onDelete('cascade');
            $table->foreignId('approver_id')->constrained('users');
            $table->enum('action', ['approved','rejected']);
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('approvals');
        Schema::dropIfExists('document_signatures');
        Schema::dropIfExists('document_steps');
        Schema::dropIfExists('documents');
    }
};